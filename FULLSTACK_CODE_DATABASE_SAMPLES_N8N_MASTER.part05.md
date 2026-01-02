---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 5
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 5 of 51)

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

---[FILE: hiring-banner.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/hiring-banner.config.ts
Signals: N/A
Excerpt (<=80 chars): export class HiringBannerConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HiringBannerConfig
```

--------------------------------------------------------------------------------

---[FILE: instance-settings-config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/instance-settings-config.ts
Signals: N/A
Excerpt (<=80 chars): export class InstanceSettingsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceSettingsConfig
```

--------------------------------------------------------------------------------

---[FILE: license.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/license.config.ts
Signals: N/A
Excerpt (<=80 chars): export class LicenseConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseConfig
```

--------------------------------------------------------------------------------

---[FILE: logging.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/logging.config.ts
Signals: Zod
Excerpt (<=80 chars): export const LOG_SCOPES = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LOG_SCOPES
- CronLoggingConfig
- LoggingConfig
- LogScope
```

--------------------------------------------------------------------------------

---[FILE: mfa.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/mfa.config.ts
Signals: N/A
Excerpt (<=80 chars): export class MfaConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MfaConfig
```

--------------------------------------------------------------------------------

---[FILE: multi-main-setup.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/multi-main-setup.config.ts
Signals: N/A
Excerpt (<=80 chars): export class MultiMainSetupConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MultiMainSetupConfig
```

--------------------------------------------------------------------------------

---[FILE: nodes.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/nodes.config.ts
Signals: N/A
Excerpt (<=80 chars): export class NodesConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodesConfig
```

--------------------------------------------------------------------------------

---[FILE: personalization.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/personalization.config.ts
Signals: N/A
Excerpt (<=80 chars): export class PersonalizationConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PersonalizationConfig
```

--------------------------------------------------------------------------------

---[FILE: public-api.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/public-api.config.ts
Signals: N/A
Excerpt (<=80 chars): export class PublicApiConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicApiConfig
```

--------------------------------------------------------------------------------

---[FILE: redis.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/redis.config.ts
Signals: N/A
Excerpt (<=80 chars): export class RedisConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RedisConfig
```

--------------------------------------------------------------------------------

---[FILE: runners.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/runners.config.ts
Signals: Zod
Excerpt (<=80 chars):  export type TaskRunnerMode = z.infer<typeof runnerModeSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnersConfig
- TaskRunnerMode
```

--------------------------------------------------------------------------------

---[FILE: scaling-mode.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/scaling-mode.config.ts
Signals: N/A
Excerpt (<=80 chars): export class ScalingModeConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScalingModeConfig
```

--------------------------------------------------------------------------------

---[FILE: security.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/security.config.ts
Signals: N/A
Excerpt (<=80 chars): export class SecurityConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityConfig
```

--------------------------------------------------------------------------------

---[FILE: sentry.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/sentry.config.ts
Signals: N/A
Excerpt (<=80 chars): export class SentryConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SentryConfig
```

--------------------------------------------------------------------------------

---[FILE: sso.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/sso.config.ts
Signals: N/A
Excerpt (<=80 chars): export class SsoConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SsoConfig
```

--------------------------------------------------------------------------------

---[FILE: tags.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/tags.config.ts
Signals: N/A
Excerpt (<=80 chars): export class TagsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagsConfig
```

--------------------------------------------------------------------------------

---[FILE: templates.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/templates.config.ts
Signals: N/A
Excerpt (<=80 chars): export class TemplatesConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplatesConfig
```

--------------------------------------------------------------------------------

---[FILE: user-management.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/user-management.config.ts
Signals: Zod
Excerpt (<=80 chars): export class TemplateConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplateConfig
- UserManagementConfig
```

--------------------------------------------------------------------------------

---[FILE: version-notifications.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/version-notifications.config.ts
Signals: N/A
Excerpt (<=80 chars): export class VersionNotificationsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionNotificationsConfig
```

--------------------------------------------------------------------------------

---[FILE: workflow-history.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/workflow-history.config.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowHistoryConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistoryConfig
```

--------------------------------------------------------------------------------

---[FILE: workflows.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/workflows.config.ts
Signals: Zod
Excerpt (<=80 chars): export class WorkflowsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowsConfig
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/config/src/utils/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function getN8nFolder(): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getN8nFolder
```

--------------------------------------------------------------------------------

---[FILE: api.ts]---
Location: n8n-master/packages/@n8n/constants/src/api.ts
Signals: N/A
Excerpt (<=80 chars): export const N8N_IO_BASE_URL = 'https://api.n8n.io/api/';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8N_IO_BASE_URL
```

--------------------------------------------------------------------------------

---[FILE: browser.ts]---
Location: n8n-master/packages/@n8n/constants/src/browser.ts
Signals: N/A
Excerpt (<=80 chars): export const BROWSER_ID_STORAGE_KEY = 'n8n-browserId';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BROWSER_ID_STORAGE_KEY
```

--------------------------------------------------------------------------------

---[FILE: community-nodes.ts]---
Location: n8n-master/packages/@n8n/constants/src/community-nodes.ts
Signals: N/A
Excerpt (<=80 chars): export const NPM_COMMUNITY_NODE_SEARCH_API_URL = 'https://api.npms.io/v2/';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NPM_COMMUNITY_NODE_SEARCH_API_URL
```

--------------------------------------------------------------------------------

---[FILE: execution.ts]---
Location: n8n-master/packages/@n8n/constants/src/execution.ts
Signals: N/A
Excerpt (<=80 chars): export const TOOL_EXECUTOR_NODE_NAME = 'PartialExecutionToolExecutor';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TOOL_EXECUTOR_NODE_NAME
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/constants/src/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const LICENSE_FEATURES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LICENSE_FEATURES
- LICENSE_QUOTAS
- UNLIMITED_LICENSE_QUOTA
- DEFAULT_WORKFLOW_HISTORY_PRUNE_LIMIT
- LDAP_FEATURE_NAME
- MIN_PASSWORD_CHAR_LENGTH
- MAX_PASSWORD_CHAR_LENGTH
- BooleanLicenseFeature
- NumericLicenseFeature
- ConnectionSecurity
- LdapConfig
```

--------------------------------------------------------------------------------

---[FILE: instance.ts]---
Location: n8n-master/packages/@n8n/constants/src/instance.ts
Signals: N/A
Excerpt (<=80 chars): export const INSTANCE_ID_HEADER = 'n8n-instance-id';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INSTANCE_ID_HEADER
- INSTANCE_VERSION_HEADER
- INSTANCE_TYPES
- INSTANCE_ROLES
- InstanceType
- InstanceRole
```

--------------------------------------------------------------------------------

---[FILE: logstreaming.ts]---
Location: n8n-master/packages/@n8n/constants/src/logstreaming.ts
Signals: N/A
Excerpt (<=80 chars):  export const LOGSTREAMING_DEFAULT_MAX_FREE_SOCKETS = 5;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LOGSTREAMING_DEFAULT_MAX_FREE_SOCKETS
- LOGSTREAMING_DEFAULT_MAX_SOCKETS
- LOGSTREAMING_DEFAULT_MAX_TOTAL_SOCKETS
- LOGSTREAMING_DEFAULT_SOCKET_TIMEOUT_MS
- LOGSTREAMING_CB_DEFAULT_MAX_DURATION_MS
- LOGSTREAMING_CB_DEFAULT_MAX_FAILURES
- LOGSTREAMING_CB_DEFAULT_HALF_OPEN_REQUESTS
- LOGSTREAMING_CB_DEFAULT_FAILURE_WINDOW_MS
- LOGSTREAMING_CB_DEFAULT_CONCURRENT_HALF_OPEN_REQUESTS
```

--------------------------------------------------------------------------------

---[FILE: time.ts]---
Location: n8n-master/packages/@n8n/constants/src/time.ts
Signals: N/A
Excerpt (<=80 chars): export const Time = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Time
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/@n8n/db/src/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export function builtInRoleToRoleObject(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- builtInRoleToRoleObject
- ALL_BUILTIN_ROLES
- GLOBAL_OWNER_ROLE
- GLOBAL_ADMIN_ROLE
- GLOBAL_MEMBER_ROLE
- GLOBAL_CHAT_USER_ROLE
- PROJECT_OWNER_ROLE
- PROJECT_ADMIN_ROLE
- PROJECT_EDITOR_ROLE
- PROJECT_VIEWER_ROLE
- PROJECT_CHAT_USER_ROLE
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/db/src/index.ts
Signals: TypeORM
Excerpt (<=80 chars): export type { FindOptionsWhere } from '@n8n/typeorm';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: db-connection-options.ts]---
Location: n8n-master/packages/@n8n/db/src/connection/db-connection-options.ts
Signals: N/A
Excerpt (<=80 chars): export class DbConnectionOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DbConnectionOptions
```

--------------------------------------------------------------------------------

---[FILE: db-connection.ts]---
Location: n8n-master/packages/@n8n/db/src/connection/db-connection.ts
Signals: TypeORM
Excerpt (<=80 chars): export class DbConnection {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DbConnection
```

--------------------------------------------------------------------------------

---[FILE: db-connection.test.ts]---
Location: n8n-master/packages/@n8n/db/src/connection/__tests__/db-connection.test.ts
Signals: TypeORM
Excerpt (<=80 chars): /* eslint-disable @typescript-eslint/unbound-method */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: abstract-entity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/abstract-entity.ts
Signals: N/A
Excerpt (<=80 chars):  export const { type: dbType } = Container.get(GlobalConfig).database;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsonColumn
- DateTimeColumn
- BinaryColumn
- jsonColumnType
- datetimeColumnType
- WithStringId
- WithCreatedAt
- WithUpdatedAt
- WithTimestamps
- WithTimestampsAndStringId
```

--------------------------------------------------------------------------------

---[FILE: annotation-tag-entity.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/annotation-tag-entity.ee.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AnnotationTagEntity extends WithTimestampsAndStringId {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnnotationTagEntity
```

--------------------------------------------------------------------------------

---[FILE: annotation-tag-mapping.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/annotation-tag-mapping.ee.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AnnotationTagMapping {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnnotationTagMapping
```

--------------------------------------------------------------------------------

---[FILE: api-key.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/api-key.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ApiKey extends WithTimestampsAndStringId {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApiKey
```

--------------------------------------------------------------------------------

---[FILE: auth-identity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/auth-identity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AuthIdentity extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthIdentity
```

--------------------------------------------------------------------------------

---[FILE: auth-provider-sync-history.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/auth-provider-sync-history.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AuthProviderSyncHistory {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthProviderSyncHistory
```

--------------------------------------------------------------------------------

---[FILE: binary-data-file.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/binary-data-file.ts
Signals: Zod, TypeORM
Excerpt (<=80 chars):  export const SourceTypeSchema = z.enum(['execution', 'chat_message_attachmen...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceTypeSchema
- BinaryDataFile
- SourceType
```

--------------------------------------------------------------------------------

---[FILE: credentials-entity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/credentials-entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class CredentialsEntity extends WithTimestampsAndStringId implements I...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsEntity
```

--------------------------------------------------------------------------------

---[FILE: event-destinations.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/event-destinations.ts
Signals: TypeORM
Excerpt (<=80 chars): export class EventDestinations extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventDestinations
```

--------------------------------------------------------------------------------

---[FILE: execution-annotation.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/execution-annotation.ee.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExecutionAnnotation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionAnnotation
```

--------------------------------------------------------------------------------

---[FILE: execution-data.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/execution-data.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExecutionData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionData
```

--------------------------------------------------------------------------------

---[FILE: execution-entity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/execution-entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExecutionEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionEntity
```

--------------------------------------------------------------------------------

---[FILE: execution-metadata.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/execution-metadata.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExecutionMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionMetadata
```

--------------------------------------------------------------------------------

---[FILE: folder-tag-mapping.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/folder-tag-mapping.ts
Signals: TypeORM
Excerpt (<=80 chars): export class FolderTagMapping {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderTagMapping
```

--------------------------------------------------------------------------------

---[FILE: folder.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/folder.ts
Signals: TypeORM
Excerpt (<=80 chars): export class Folder extends WithTimestampsAndStringId {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Folder
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const entities = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- entities
```

--------------------------------------------------------------------------------

---[FILE: invalid-auth-token.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/invalid-auth-token.ts
Signals: TypeORM
Excerpt (<=80 chars): export class InvalidAuthToken {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidAuthToken
```

--------------------------------------------------------------------------------

---[FILE: processed-data.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/processed-data.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ProcessedData extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProcessedData
```

--------------------------------------------------------------------------------

---[FILE: project-relation.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/project-relation.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ProjectRelation extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectRelation
```

--------------------------------------------------------------------------------

---[FILE: project.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/project.ts
Signals: TypeORM
Excerpt (<=80 chars): export class Project extends WithTimestampsAndStringId {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Project
```

--------------------------------------------------------------------------------

---[FILE: role.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/role.ts
Signals: TypeORM
Excerpt (<=80 chars): export class Role extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Role
```

--------------------------------------------------------------------------------

---[FILE: scope.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/scope.ts
Signals: TypeORM
Excerpt (<=80 chars): export class Scope {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Scope
```

--------------------------------------------------------------------------------

---[FILE: settings.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/settings.ts
Signals: TypeORM
Excerpt (<=80 chars): export class Settings implements ISettingsDb {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Settings
```

--------------------------------------------------------------------------------

---[FILE: shared-credentials.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/shared-credentials.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SharedCredentials extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharedCredentials
```

--------------------------------------------------------------------------------

---[FILE: shared-workflow.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/shared-workflow.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SharedWorkflow extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharedWorkflow
```

--------------------------------------------------------------------------------

---[FILE: tag-entity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/tag-entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class TagEntity extends WithTimestampsAndStringId {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagEntity
```

--------------------------------------------------------------------------------

---[FILE: test-case-execution.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/test-case-execution.ee.ts
Signals: TypeORM
Excerpt (<=80 chars):  export type TestCaseRunMetrics = Record<string, number | boolean>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCaseExecution
- TestCaseRunMetrics
- TestCaseExecutionStatus
```

--------------------------------------------------------------------------------

---[FILE: test-run.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/test-run.ee.ts
Signals: TypeORM
Excerpt (<=80 chars):  export type TestRunStatus = 'new' | 'running' | 'completed' | 'error' | 'can...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRun
- TestRunStatus
```

--------------------------------------------------------------------------------

---[FILE: types-db.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/types-db.ts
Signals: Express, Zod
Excerpt (<=80 chars):  export type UsageCount = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isAuthProviderType
- UsageCount
- ITagDb
- ITagWithCountDb
- UserSettings
- SlimProject
- CreateExecutionPayload
- Query
- RangeQuery
- CountQuery
- ExecutionSummaryWithScopes
- SortOrder
- Plain
- WithSharing
- WithOwnership
- WithOwnedByAndSharedWith
- WithScopes
```

--------------------------------------------------------------------------------

---[FILE: user.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/user.ts
Signals: TypeORM
Excerpt (<=80 chars): export class User extends WithTimestamps implements IUser, AuthPrincipal {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- User
```

--------------------------------------------------------------------------------

---[FILE: variables.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/variables.ts
Signals: TypeORM
Excerpt (<=80 chars): export class Variables extends WithStringId {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Variables
```

--------------------------------------------------------------------------------

---[FILE: webhook-entity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/webhook-entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WebhookEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookEntity
```

--------------------------------------------------------------------------------

---[FILE: workflow-dependency-entity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/workflow-dependency-entity.ts
Signals: TypeORM
Excerpt (<=80 chars):  export type DependencyType = 'credentialId' | 'nodeType' | 'webhookPath' | '...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowDependency
- DependencyType
```

--------------------------------------------------------------------------------

---[FILE: workflow-entity.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/workflow-entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowEntity extends WithTimestampsAndStringId implements IWor...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowEntity
```

--------------------------------------------------------------------------------

---[FILE: workflow-history.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/workflow-history.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowHistory extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistory
```

--------------------------------------------------------------------------------

---[FILE: workflow-publish-history.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/workflow-publish-history.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowPublishHistory extends WithCreatedAt {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowPublishHistory
```

--------------------------------------------------------------------------------

---[FILE: workflow-statistics.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/workflow-statistics.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowStatistics {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStatistics
```

--------------------------------------------------------------------------------

---[FILE: workflow-tag-mapping.ts]---
Location: n8n-master/packages/@n8n/db/src/entities/workflow-tag-mapping.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowTagMapping {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowTagMapping
```

--------------------------------------------------------------------------------

---[FILE: migration-helpers.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/migration-helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const wrapMigration = (migration: Migration) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- wrapMigration
```

--------------------------------------------------------------------------------

---[FILE: migration-types.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/migration-types.ts
Signals: N/A
Excerpt (<=80 chars):  export type DatabaseType = 'mariadb' | 'postgresdb' | 'mysqldb' | 'sqlite';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DatabaseType
- MigrationFn
- InsertResult
- MigrationContext
- BaseMigration
- ReversibleMigration
- IrreversibleMigration
- Migration
```

--------------------------------------------------------------------------------

---[FILE: 1620821879465-UniqueWorkflowNames.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1620821879465-UniqueWorkflowNames.ts
Signals: N/A
Excerpt (<=80 chars):  export class UniqueWorkflowNames1620821879465 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UniqueWorkflowNames1620821879465
```

--------------------------------------------------------------------------------

---[FILE: 1630330987096-UpdateWorkflowCredentials.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1630330987096-UpdateWorkflowCredentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateWorkflowCredentials1630330987096 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateWorkflowCredentials1630330987096
```

--------------------------------------------------------------------------------

---[FILE: 1658930531669-AddNodeIds.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1658930531669-AddNodeIds.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddNodeIds1658930531669 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNodeIds1658930531669
```

--------------------------------------------------------------------------------

---[FILE: 1659888469333-AddJsonKeyPinData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1659888469333-AddJsonKeyPinData.ts
Signals: N/A
Excerpt (<=80 chars): export class AddJsonKeyPinData1659888469333 implements IrreversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddJsonKeyPinData1659888469333
```

--------------------------------------------------------------------------------

---[FILE: 1669739707124-AddWorkflowVersionIdColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1669739707124-AddWorkflowVersionIdColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowVersionIdColumn1669739707124 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowVersionIdColumn1669739707124
```

--------------------------------------------------------------------------------

---[FILE: 1671726148419-RemoveWorkflowDataLoadedFlag.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1671726148419-RemoveWorkflowDataLoadedFlag.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveWorkflowDataLoadedFlag1671726148419 implements Reversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveWorkflowDataLoadedFlag1671726148419
```

--------------------------------------------------------------------------------

---[FILE: 1674509946020-CreateLdapEntities.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1674509946020-CreateLdapEntities.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateLdapEntities1674509946020 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateLdapEntities1674509946020
```

--------------------------------------------------------------------------------

---[FILE: 1675940580449-PurgeInvalidWorkflowConnections.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1675940580449-PurgeInvalidWorkflowConnections.ts
Signals: N/A
Excerpt (<=80 chars):  export class PurgeInvalidWorkflowConnections1675940580449 implements Irrever...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PurgeInvalidWorkflowConnections1675940580449
```

--------------------------------------------------------------------------------

---[FILE: 1690000000030-RemoveResetPasswordColumns.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1690000000030-RemoveResetPasswordColumns.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveResetPasswordColumns1690000000030 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveResetPasswordColumns1690000000030
```

--------------------------------------------------------------------------------

---[FILE: 1690000000040-AddMfaColumns.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1690000000040-AddMfaColumns.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddMfaColumns1690000000030 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddMfaColumns1690000000030
```

--------------------------------------------------------------------------------

---[FILE: 1691088862123-CreateWorkflowNameIndex.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1691088862123-CreateWorkflowNameIndex.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateWorkflowNameIndex1691088862123 implements ReversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWorkflowNameIndex1691088862123
```

--------------------------------------------------------------------------------

---[FILE: 1692967111175-CreateWorkflowHistoryTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1692967111175-CreateWorkflowHistoryTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateWorkflowHistoryTable1692967111175 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWorkflowHistoryTable1692967111175
```

--------------------------------------------------------------------------------

---[FILE: 1693491613982-ExecutionSoftDelete.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1693491613982-ExecutionSoftDelete.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionSoftDelete1693491613982 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionSoftDelete1693491613982
```

--------------------------------------------------------------------------------

---[FILE: 1693554410387-DisallowOrphanExecutions.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1693554410387-DisallowOrphanExecutions.ts
Signals: N/A
Excerpt (<=80 chars):  export class DisallowOrphanExecutions1693554410387 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisallowOrphanExecutions1693554410387
```

--------------------------------------------------------------------------------

---[FILE: 1695128658538-AddWorkflowMetadata.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1695128658538-AddWorkflowMetadata.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowMetadata1695128658538 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowMetadata1695128658538
```

--------------------------------------------------------------------------------

---[FILE: 1695829275184-ModifyWorkflowHistoryNodesAndConnections.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1695829275184-ModifyWorkflowHistoryNodesAndConnections.ts
Signals: N/A
Excerpt (<=80 chars):  export class ModifyWorkflowHistoryNodesAndConnections1695829275184 implement...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModifyWorkflowHistoryNodesAndConnections1695829275184
```

--------------------------------------------------------------------------------

---[FILE: 1700571993961-AddGlobalAdminRole.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1700571993961-AddGlobalAdminRole.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddGlobalAdminRole1700571993961 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddGlobalAdminRole1700571993961
```

--------------------------------------------------------------------------------

---[FILE: 1705429061930-DropRoleMapping.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1705429061930-DropRoleMapping.ts
Signals: N/A
Excerpt (<=80 chars):  export class DropRoleMapping1705429061930 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropRoleMapping1705429061930
```

--------------------------------------------------------------------------------

---[FILE: 1711018413374-RemoveFailedExecutionStatus.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1711018413374-RemoveFailedExecutionStatus.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveFailedExecutionStatus1711018413374 implements Irreversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveFailedExecutionStatus1711018413374
```

--------------------------------------------------------------------------------

---[FILE: 1711390882123-MoveSshKeysToDatabase.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1711390882123-MoveSshKeysToDatabase.ts
Signals: N/A
Excerpt (<=80 chars): export class MoveSshKeysToDatabase1711390882123 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MoveSshKeysToDatabase1711390882123
```

--------------------------------------------------------------------------------

---[FILE: 1712044305787-RemoveNodesAccess.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1712044305787-RemoveNodesAccess.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveNodesAccess1712044305787 implements IrreversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveNodesAccess1712044305787
```

--------------------------------------------------------------------------------

---[FILE: 1714133768519-CreateProject.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1714133768519-CreateProject.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateProject1714133768519 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateProject1714133768519
```

--------------------------------------------------------------------------------

---[FILE: 1714133768521-MakeExecutionStatusNonNullable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1714133768521-MakeExecutionStatusNonNullable.ts
Signals: N/A
Excerpt (<=80 chars):  export class MakeExecutionStatusNonNullable1714133768521 implements Irrevers...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MakeExecutionStatusNonNullable1714133768521
```

--------------------------------------------------------------------------------

````
