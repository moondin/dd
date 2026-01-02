---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 29
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 29 of 37)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - ToolJet-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ToolJet-develop
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: query_permissions.entity.ts]---
Location: ToolJet-develop/server/src/entities/query_permissions.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class QueryPermission {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryPermission
```

--------------------------------------------------------------------------------

---[FILE: query_users.entity.ts]---
Location: ToolJet-develop/server/src/entities/query_users.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class QueryUser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryUser
```

--------------------------------------------------------------------------------

---[FILE: selfhost_customers.entity.ts]---
Location: ToolJet-develop/server/src/entities/selfhost_customers.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SelfhostCustomers extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelfhostCustomers
```

--------------------------------------------------------------------------------

---[FILE: selfhost_customers_ai_feature.entity.ts]---
Location: ToolJet-develop/server/src/entities/selfhost_customers_ai_feature.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SelfhostCustomersAiFeature extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelfhostCustomersAiFeature
```

--------------------------------------------------------------------------------

---[FILE: selfhost_customer_license.entity.ts]---
Location: ToolJet-develop/server/src/entities/selfhost_customer_license.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SelfhostCustomerLicense extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelfhostCustomerLicense
```

--------------------------------------------------------------------------------

---[FILE: sso_config.entity.ts]---
Location: ToolJet-develop/server/src/entities/sso_config.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SSOConfigs {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSOConfigs
```

--------------------------------------------------------------------------------

---[FILE: sso_config_oidc_group_sync.entity.ts]---
Location: ToolJet-develop/server/src/entities/sso_config_oidc_group_sync.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SsoConfigOidcGroupSync {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SsoConfigOidcGroupSync
```

--------------------------------------------------------------------------------

---[FILE: sso_response.entity.ts]---
Location: ToolJet-develop/server/src/entities/sso_response.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SSOResponse extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSOResponse
```

--------------------------------------------------------------------------------

---[FILE: thread.entity.ts]---
Location: ToolJet-develop/server/src/entities/thread.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class Thread extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Thread
```

--------------------------------------------------------------------------------

---[FILE: user.entity.ts]---
Location: ToolJet-develop/server/src/entities/user.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class User extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- User
```

--------------------------------------------------------------------------------

---[FILE: user_details.entity.ts]---
Location: ToolJet-develop/server/src/entities/user_details.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class UserDetails {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserDetails
```

--------------------------------------------------------------------------------

---[FILE: user_group_permission.entity.ts]---
Location: ToolJet-develop/server/src/entities/user_group_permission.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class UserGroupPermission extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserGroupPermission
```

--------------------------------------------------------------------------------

---[FILE: user_personal_access_tokens.entity.ts]---
Location: ToolJet-develop/server/src/entities/user_personal_access_tokens.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class UserPersonalAccessToken extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserPersonalAccessToken
```

--------------------------------------------------------------------------------

---[FILE: user_sessions.entity.ts]---
Location: ToolJet-develop/server/src/entities/user_sessions.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class UserSessions extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserSessions
```

--------------------------------------------------------------------------------

---[FILE: white_labelling.entity.ts]---
Location: ToolJet-develop/server/src/entities/white_labelling.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WhiteLabelling {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhiteLabelling
```

--------------------------------------------------------------------------------

---[FILE: workflow_execution.entity.ts]---
Location: ToolJet-develop/server/src/entities/workflow_execution.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowExecution {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecution
```

--------------------------------------------------------------------------------

---[FILE: workflow_execution_edge.entity.ts]---
Location: ToolJet-develop/server/src/entities/workflow_execution_edge.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowExecutionEdge {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecutionEdge
```

--------------------------------------------------------------------------------

---[FILE: workflow_execution_node.entity.ts]---
Location: ToolJet-develop/server/src/entities/workflow_execution_node.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowExecutionNode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecutionNode
```

--------------------------------------------------------------------------------

---[FILE: workflow_schedule.entity.ts]---
Location: ToolJet-develop/server/src/entities/workflow_schedule.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowSchedule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSchedule
```

--------------------------------------------------------------------------------

---[FILE: organization_gitlab.entity.ts]---
Location: ToolJet-develop/server/src/entities/gitsync_entities/organization_gitlab.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class OrganizationGitLab extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationGitLab
```

--------------------------------------------------------------------------------

---[FILE: organization_git_https.entity.ts]---
Location: ToolJet-develop/server/src/entities/gitsync_entities/organization_git_https.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class OrganizationGitHttps extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationGitHttps
```

--------------------------------------------------------------------------------

---[FILE: organization_git_ssh.entity.ts]---
Location: ToolJet-develop/server/src/entities/gitsync_entities/organization_git_ssh.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class OrganizationGitSsh {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationGitSsh
```

--------------------------------------------------------------------------------

---[FILE: bootstrap.helper.ts]---
Location: ToolJet-develop/server/src/helpers/bootstrap.helper.ts
Signals: NestJS
Excerpt (<=80 chars): export function createLogger(context: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLogger
- rawBodyBuffer
- replaceSubpathPlaceHoldersInStaticAssets
- setSecurityHeaders
- buildVersion
- setupGlobalAgent
- logStartupInfo
- logShutdownInfo
```

--------------------------------------------------------------------------------

---[FILE: database.helper.ts]---
Location: ToolJet-develop/server/src/helpers/database.helper.ts
Signals: TypeORM
Excerpt (<=80 chars):  export function setConnectionInstance(dataSource: DataSource) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setConnectionInstance
```

--------------------------------------------------------------------------------

---[FILE: edition.helper.ts]---
Location: ToolJet-develop/server/src/helpers/edition.helper.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export function getEditionPriority(edition: string): number {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getEditionPriority
- isEditionDowngrade
```

--------------------------------------------------------------------------------

---[FILE: errors.constants.ts]---
Location: ToolJet-develop/server/src/helpers/errors.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const SIGNUP_ERRORS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SIGNUP_ERRORS
```

--------------------------------------------------------------------------------

---[FILE: error_type.constant.ts]---
Location: ToolJet-develop/server/src/helpers/error_type.constant.ts
Signals: N/A
Excerpt (<=80 chars): export const APP_ERROR_TYPE = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APP_ERROR_TYPE
```

--------------------------------------------------------------------------------

---[FILE: import_export.helpers.ts]---
Location: ToolJet-develop/server/src/helpers/import_export.helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function updateEntityReferences(node, resourceMapping: Record<string,...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateEntityReferences
- isValidUUID
- extractAndReplaceReferencesFromString
```

--------------------------------------------------------------------------------

---[FILE: migration.helper.ts]---
Location: ToolJet-develop/server/src/helpers/migration.helper.ts
Signals: TypeORM
Excerpt (<=80 chars):  export function addWait(milliseconds) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addWait
- updateCurrentEnvironmentId
- processDataInBatches
- MigrationProgress
```

--------------------------------------------------------------------------------

---[FILE: redis.ts]---
Location: ToolJet-develop/server/src/helpers/redis.ts
Signals: N/A
Excerpt (<=80 chars): export class RedisInstance {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RedisInstance
- RedisPubSub
```

--------------------------------------------------------------------------------

---[FILE: tjdb.migration.helper.ts]---
Location: ToolJet-develop/server/src/helpers/tjdb.migration.helper.ts
Signals: TypeORM
Excerpt (<=80 chars): import { tooljetDbOrmconfig } from 'ormconfig';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: tooljet_db.helper.ts]---
Location: ToolJet-develop/server/src/helpers/tooljet_db.helper.ts
Signals: TypeORM
Excerpt (<=80 chars):  export function findTenantSchema(organisationId: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findTenantSchema
- isSQLModeDisabled
- concatSchemaAndTableName
- modifyTjdbErrorObject
- validateTjdbJSONBColumnInputs
```

--------------------------------------------------------------------------------

---[FILE: utils.helper.ts]---
Location: ToolJet-develop/server/src/helpers/utils.helper.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export function parseJson(jsonString: string, errorMessage?: string): object {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseJson
- maybeSetSubPath
- sanitizeInput
- isJSONString
- formatTimestamp
- formatJSONB
- formatJoinsJSONBPath
- lowercaseString
- isPlural
- validateDefaultValue
- generateWorkspaceSlug
- extractFirstAndLastName
- extractMajorVersion
- checkVersionCompatibility
- isTooljetVersionWithNormalizedAppDefinitionSchem
- extractWorkFromUrl
- isVersionGreaterThan
- isVersionEqual
```

--------------------------------------------------------------------------------

---[FILE: db-search.helper.ts]---
Location: ToolJet-develop/server/src/helpers/db-utility/db-search.helper.ts
Signals: TypeORM
Excerpt (<=80 chars):  export const createWhereConditions = (searchParamObject: ConditionObject): o...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createWhereConditions
```

--------------------------------------------------------------------------------

---[FILE: db-utility.interface.ts]---
Location: ToolJet-develop/server/src/helpers/db-utility/db-utility.interface.ts
Signals: N/A
Excerpt (<=80 chars): export interface SearchParamItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConditionObject
- SearchParamItem
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: ToolJet-develop/server/src/migration-helpers/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_GROUP_PERMISSIONS_MIGRATIONS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_GROUP_PERMISSIONS_MIGRATIONS
- CreateResourcePermissionObjectGeneric
```

--------------------------------------------------------------------------------

---[FILE: data-migrations-datasource.ts]---
Location: ToolJet-develop/server/src/migration-helpers/data-migrations-datasource.ts
Signals: TypeORM
Excerpt (<=80 chars): import ormconfig from 'data-migration-config';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: db-migrations-datasource.ts]---
Location: ToolJet-develop/server/src/migration-helpers/db-migrations-datasource.ts
Signals: TypeORM
Excerpt (<=80 chars): import { ormconfig } from 'ormconfig';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: ToolJet-develop/server/src/modules/ability/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_USER_PERMISSIONS: UserPermissions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RESOURCE_TO_APP_TYPE_MAP
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/ability/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class AbilityModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbilityModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/ability/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AbilityService extends IAbilityService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbilityService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/server/src/modules/ability/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ResourcePermissionQueryObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResourcePermissionQueryObject
- ResourcesItem
- UserPermissions
- UserWorkflowPermissions
- UserAppsPermissions
- UserDataSourcePermissions
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/ability/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AbilityUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbilityUtilService
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/ability/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars): import { EntityManager } from 'typeorm';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/ai/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class AiController implements IAiController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/ai/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class AiModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/ai/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class AiService implements IAiService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/ai/util.service.ts
Signals: N/A
Excerpt (<=80 chars):  export class AiUtilService implements IAiUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/ai/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/ai/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type AiAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiAbility
```

--------------------------------------------------------------------------------

---[FILE: IAgentsService.ts]---
Location: ToolJet-develop/server/src/modules/ai/interfaces/IAgentsService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IAgentsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAgentsService
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/ai/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IAiController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAiController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/ai/interfaces/IService.ts
Signals: Express
Excerpt (<=80 chars):  export interface IAiService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAiService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/ai/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IAiUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAiUtilService
```

--------------------------------------------------------------------------------

---[FILE: ai-conversation-message.repository.ts]---
Location: ToolJet-develop/server/src/modules/ai/repositories/ai-conversation-message.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AiConversationMessageRepository extends Repository<AiConversatio...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiConversationMessageRepository
```

--------------------------------------------------------------------------------

---[FILE: ai-conversation.repository.ts]---
Location: ToolJet-develop/server/src/modules/ai/repositories/ai-conversation.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AiConversationRepository extends Repository<AiConversation> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiConversationRepository
```

--------------------------------------------------------------------------------

---[FILE: ai-response-vote.repository.ts]---
Location: ToolJet-develop/server/src/modules/ai/repositories/ai-response-vote.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AiResponseVoteRepository extends Repository<AiResponseVote> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiResponseVoteRepository
```

--------------------------------------------------------------------------------

---[FILE: artifact.repository.ts]---
Location: ToolJet-develop/server/src/modules/ai/repositories/artifact.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ArtifactRepository extends Repository<Artifact> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactRepository
```

--------------------------------------------------------------------------------

---[FILE: agents.service.ts]---
Location: ToolJet-develop/server/src/modules/ai/services/agents.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class AgentsService implements IAgentsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AgentsService
```

--------------------------------------------------------------------------------

---[FILE: graph.service.ts]---
Location: ToolJet-develop/server/src/modules/ai/services/graph.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class GraphService implements OnModuleInit, OnModuleDestroy {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GraphService
```

--------------------------------------------------------------------------------

---[FILE: ability-factory.ts]---
Location: ToolJet-develop/server/src/modules/app/ability-factory.ts
Signals: NestJS
Excerpt (<=80 chars): import { User } from 'src/entities/user.entity';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/app/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppController
```

--------------------------------------------------------------------------------

---[FILE: loader.ts]---
Location: ToolJet-develop/server/src/modules/app/loader.ts
Signals: NestJS
Excerpt (<=80 chars):  export class AppModuleLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppModuleLoader
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/app/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppModule implements OnModuleInit {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppModule
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/server/src/modules/app/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface UserAllPermissions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserAllPermissions
- FeatureConfig
- ResourceDetails
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/app/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const LICENSE_FEATURE_ID_KEY = 'tjLicenseFeatureId';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LICENSE_FEATURE_ID_KEY
- getImportPath
- AUDIT_LOGS_REQUEST_CONTEXT_KEY
```

--------------------------------------------------------------------------------

---[FILE: getConnection.ts]---
Location: ToolJet-develop/server/src/modules/app/database/getConnection.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class GetConnection {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetConnection
```

--------------------------------------------------------------------------------

---[FILE: ability.decorator.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/ability.decorator.ts
Signals: NestJS
Excerpt (<=80 chars):  export const AbilityDecorator = createParamDecorator(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbilityDecorator
- AppAbility
```

--------------------------------------------------------------------------------

---[FILE: app.decorator.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/app.decorator.ts
Signals: NestJS
Excerpt (<=80 chars):  export const AppDecorator = createParamDecorator((data: unknown, ctx: Execut...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppDecorator
```

--------------------------------------------------------------------------------

---[FILE: data-source.decorator.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/data-source.decorator.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import { DataSource as DataSourceEntity } from '@entities/data_source.entity';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: init-feature.decorator.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/init-feature.decorator.ts
Signals: NestJS
Excerpt (<=80 chars):  export const InitFeature = (featureId: any) => SetMetadata('tjFeatureId', fe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InitFeature
```

--------------------------------------------------------------------------------

---[FILE: init-module.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/init-module.ts
Signals: NestJS
Excerpt (<=80 chars):  export const InitModule = (moduleId: MODULES) => SetMetadata('tjModuleId', m...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InitModule
```

--------------------------------------------------------------------------------

---[FILE: require-feature.decorator.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/require-feature.decorator.ts
Signals: NestJS
Excerpt (<=80 chars):  export const RequireFeature = (featureId: LICENSE_FIELD) => SetMetadata(LICE...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequireFeature
```

--------------------------------------------------------------------------------

---[FILE: user-permission.decorator.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/user-permission.decorator.ts
Signals: NestJS
Excerpt (<=80 chars):  export const UserPermissionsDecorator = createParamDecorator(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserPermissionsDecorator
```

--------------------------------------------------------------------------------

---[FILE: user.decorator.ts]---
Location: ToolJet-develop/server/src/modules/app/decorators/user.decorator.ts
Signals: NestJS
Excerpt (<=80 chars): import { createParamDecorator, ExecutionContext } from '@nestjs/common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: all-exceptions-filter.ts]---
Location: ToolJet-develop/server/src/modules/app/filters/all-exceptions-filter.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AllExceptionsFilter implements ExceptionFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AllExceptionsFilter
```

--------------------------------------------------------------------------------

---[FILE: tooljetdb-exception-filter.ts]---
Location: ToolJet-develop/server/src/modules/app/filters/tooljetdb-exception-filter.ts
Signals: NestJS
Excerpt (<=80 chars): export class TooljetDbExceptionFilter implements ExceptionFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbExceptionFilter
```

--------------------------------------------------------------------------------

---[FILE: tooljetdb-join-exceptions-filter.ts]---
Location: ToolJet-develop/server/src/modules/app/filters/tooljetdb-join-exceptions-filter.ts
Signals: NestJS
Excerpt (<=80 chars): export class TooljetDbJoinExceptionFilter implements ExceptionFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbJoinExceptionFilter
```

--------------------------------------------------------------------------------

---[FILE: ability.guard.ts]---
Location: ToolJet-develop/server/src/modules/app/guards/ability.guard.ts
Signals: NestJS
Excerpt (<=80 chars): import { Injectable, CanActivate, ExecutionContext, Type, HttpException, Forb...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: cloud-feature.guard.ts]---
Location: ToolJet-develop/server/src/modules/app/guards/cloud-feature.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class CloudFeatureGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CloudFeatureGuard
```

--------------------------------------------------------------------------------

---[FILE: organization-validate.guard.ts]---
Location: ToolJet-develop/server/src/modules/app/guards/organization-validate.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationValidateGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationValidateGuard
```

--------------------------------------------------------------------------------

---[FILE: response.interceptor.ts]---
Location: ToolJet-develop/server/src/modules/app/interceptors/response.interceptor.ts
Signals: NestJS
Excerpt (<=80 chars): export class ResponseInterceptor implements NestInterceptor {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResponseInterceptor
```

--------------------------------------------------------------------------------

---[FILE: shut-down.hook.ts]---
Location: ToolJet-develop/server/src/modules/app/schedulers/shut-down.hook.ts
Signals: NestJS
Excerpt (<=80 chars): export class ShutdownHook implements OnApplicationShutdown {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShutdownHook
```

--------------------------------------------------------------------------------

---[FILE: feature-guard.validator.ts]---
Location: ToolJet-develop/server/src/modules/app/validators/feature-guard.validator.ts
Signals: NestJS
Excerpt (<=80 chars): export class GuardValidator {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GuardValidator
- GuardValidatorModule
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppEnvironmentsController implements IAppEnvironmentsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppEnvironmentsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class AppEnvironmentsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppEnvironmentsModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppEnvironmentService implements IAppEnvironmentService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppEnvironmentService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppEnvironmentUtilService implements IAppEnvironmentUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppEnvironmentUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type AppEnvironmentAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppEnvironmentAbility
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/dto/index.ts
Signals: NestJS
Excerpt (<=80 chars):  export class CreateAppEnvironmentDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateAppEnvironmentDto
- AppEnvironmentActionParametersDto
- UpdateAppEnvironmentDto
```

--------------------------------------------------------------------------------

---[FILE: public_app_environment.guard.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/guards/public_app_environment.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PublicAppEnvironmentGuard extends AuthGuard('jwt') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicAppEnvironmentGuard
```

--------------------------------------------------------------------------------

---[FILE: IAppEnvironmentResponse.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/interfaces/IAppEnvironmentResponse.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAppEnvironmentResponse {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppEnvironmentResponse
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAppEnvironmentsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppEnvironmentsController
```

--------------------------------------------------------------------------------

---[FILE: IExtendedEnvironment.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/interfaces/IExtendedEnvironment.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IExtendedEnvironment extends AppEnvironment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IExtendedEnvironment
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IAppEnvironmentService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppEnvironmentService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/app-environments/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IAppEnvironmentUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppEnvironmentUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/app-git/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppGitController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppGitController
```

--------------------------------------------------------------------------------

````
