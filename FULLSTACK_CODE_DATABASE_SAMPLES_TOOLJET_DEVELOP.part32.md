---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 32
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 32 of 37)

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

---[FILE: data-query-app.ability.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/ability/app/data-query-app.ability.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineDataQueryAppAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineDataQueryAppAbility
```

--------------------------------------------------------------------------------

---[FILE: data-query-workflow.ability.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/ability/app/data-query-workflow.ability.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineDataQueryWorkflowAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineDataQueryWorkflowAbility
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/ability/app/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/ability/app/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/ability/data-source/guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/ability/data-source/index.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/dto/index.ts
Signals: NestJS
Excerpt (<=80 chars):  export class CreateDataQueryDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateDataQueryDto
- UpdateDataQueryDto
- UpdatingReferencesOptionsDto
- UpdateSourceDto
- IUpdatingReferencesOptions
```

--------------------------------------------------------------------------------

---[FILE: query-auth.guard.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/guards/query-auth.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class QueryAuthGuard extends AuthGuard('jwt') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: validate-query-app.guard.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/guards/validate-query-app.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class ValidateQueryAppGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateQueryAppGuard
```

--------------------------------------------------------------------------------

---[FILE: validate-query-source.guard.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/guards/validate-query-source.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ValidateQuerySourceGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateQuerySourceGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/interfaces/IController.ts
Signals: Express, TypeORM
Excerpt (<=80 chars): export interface IDataQueriesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDataQueriesController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/interfaces/IService.ts
Signals: Express, TypeORM
Excerpt (<=80 chars):  export interface IDataQueriesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDataQueriesService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/interfaces/IUtilService.ts
Signals: Express, TypeORM
Excerpt (<=80 chars):  export interface IDataQueriesUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDataQueriesUtilService
```

--------------------------------------------------------------------------------

---[FILE: status.service.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/services/status.service.ts
Signals: N/A
Excerpt (<=80 chars): export class DataQueryStatus {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataQueryStatus
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/data-queries/types/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Features {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Features
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class DataSourcesController implements IDataSourcesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataSourcesController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class DataSourcesModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataSourcesModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class DataSourcesRepository extends Repository<DataSource> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataSourcesRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class DataSourcesService implements IDataSourcesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataSourcesService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class DataSourcesUtilService implements IDataSourcesUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataSourcesUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/ability/guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/ability/index.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/dto/index.ts
Signals: NestJS
Excerpt (<=80 chars):  export class CreateDataSourceDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateDataSourceDto
- UpdateDataSourceDto
- TestDataSourceDto
- TestSampleDataSourceDto
- GetDataSourceOauthUrlDto
- AuthorizeDataSourceOauthDto
- CreateArgumentsDto
```

--------------------------------------------------------------------------------

---[FILE: validate-query-source.guard.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/guards/validate-query-source.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ValidateDataSourceGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateDataSourceGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IDataSourcesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDataSourcesController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IDataSourcesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDataSourcesService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IDataSourcesUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDataSourcesUtilService
```

--------------------------------------------------------------------------------

---[FILE: sample-db.scheduler.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/schedulers/sample-db.scheduler.ts
Signals: NestJS
Excerpt (<=80 chars): export class SampleDBScheduler {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SampleDBScheduler
```

--------------------------------------------------------------------------------

---[FILE: plugin-selector.service.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/services/plugin-selector.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class PluginsServiceSelector {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginsServiceSelector
```

--------------------------------------------------------------------------------

---[FILE: sample-ds.service.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/services/sample-ds.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class SampleDataSourceService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SampleDataSourceService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/data-sources/types/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FeaturesConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefaultDataSourceKind
- QueryService
- GetQueryVariables
- UpdateOptions
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/email/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class EmailModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/email/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class EmailService implements IEmailService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/email/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class EmailUtilService implements IEmailUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailUtilService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/email/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type EmailEventPayload =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailEventPayload
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/email/dto/index.ts
Signals: N/A
Excerpt (<=80 chars): export interface SendWelcomeEmailPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SendWelcomeEmailPayload
- SendOrganizationUserWelcomeEmailPayload
- SendPasswordResetEmailPayload
- SendCommentMentionEmailPayload
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/email/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IEmailService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEmailService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/email/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IEmailUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEmailUtilService
```

--------------------------------------------------------------------------------

---[FILE: listener.ts]---
Location: ToolJet-develop/server/src/modules/email-listener/listener.ts
Signals: NestJS
Excerpt (<=80 chars): export class EmailListener {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailListener
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/email-listener/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class EmailListenerModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailListenerModule
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/encryption/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class EncryptionModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EncryptionModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/encryption/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class EncryptionService implements IEncryptionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EncryptionService
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/encryption/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IEncryptionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEncryptionService
```

--------------------------------------------------------------------------------

---[FILE: credentials.service.ts]---
Location: ToolJet-develop/server/src/modules/encryption/services/credentials.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class CredentialsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsService
```

--------------------------------------------------------------------------------

---[FILE: events.gateway.ts]---
Location: ToolJet-develop/server/src/modules/events/events.gateway.ts
Signals: NestJS
Excerpt (<=80 chars): export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsGateway
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/events/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class EventsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsModule
```

--------------------------------------------------------------------------------

---[FILE: yjs.gateway.ts]---
Location: ToolJet-develop/server/src/modules/events/yjs.gateway.ts
Signals: NestJS
Excerpt (<=80 chars): export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- YjsGateway
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class ExternalApisController implements IExternalApisController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalApisController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class ExternalApiModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalApiModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ExternalApisService implements IExternalApisService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalApisService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ExternalApiUtilService implements IExternalApiUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalApiUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type DefaultDataSourceKind = 'restapi' | 'runjs' | 'runpy' | 'tooljet...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefaultDataSourceKind
- NewRevampedComponent
- DefaultDataSourceName
```

--------------------------------------------------------------------------------

---[FILE: apps.controller.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/controllers/apps.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class ExternalApisAppsController implements IExternalApisAppsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalApisAppsController
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class GroupDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupDto
- WorkspaceDto
- UpdateGivenWorkspaceDto
- CreateUserDto
- UpdateUserDto
- UpdateUserWorkspaceDto
- OrganizationGitCreateDto
- GithubHttpsConfigDTO
- AppGitPullDto
- AppGitPushDto
- VersionDto
- AppWithVersionsDto
- WorkspaceAppsResponseDto
- AppImportRequestDto
- AppImportDto
- ImportTooljetDatabaseDto
- GeneratePATDto
- ValidatePATSessionDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/Interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IExternalApisController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IExternalApisController
- IExternalApisAppsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/Interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IExternalApisService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IExternalApisService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/Interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars): export interface IExternalApiUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IExternalApiUtilService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/external-apis/types/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FeaturesConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateEditUserGroupAdditionObject
- AppResourceMappings
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/feature/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/feature/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/files/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class FilesController implements IFilesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilesController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/files/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class FilesModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilesModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/files/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FilesRepository extends Repository<File> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilesRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/files/service.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class FilesService implements IFilesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilesService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/files/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/files/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/files/dto/index.ts
Signals: NestJS
Excerpt (<=80 chars):  export class CreateFileDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateFileDto
- UpdateFileDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/files/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IFilesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFilesController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/files/interfaces/IService.ts
Signals: NestJS, Express
Excerpt (<=80 chars):  export interface IFilesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFilesService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class FolderAppsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderAppsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class FolderAppsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderAppsModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FolderAppsService implements IFolderAppsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderAppsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FolderAppsUtilService implements IFolderAppsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderAppsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IFolderAppsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFolderAppsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/folder-apps/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IFolderAppsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFolderAppsUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/folders/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class FoldersController implements IFoldersController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FoldersController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/folders/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class FoldersModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FoldersModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/folders/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FoldersService implements IFoldersService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FoldersService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/folders/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FoldersUtilService implements IFoldersUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FoldersUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/folders/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/folders/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/folders/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateFolderDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateFolderDto
- UpdateFolderDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/folders/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars): export interface IFoldersController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFoldersController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/folders/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IFoldersService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFoldersService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/folders/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IFoldersUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFoldersUtilService
```

--------------------------------------------------------------------------------

---[FILE: base-git-util.service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/base-git-util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class BaseGitUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseGitUtilService
```

--------------------------------------------------------------------------------

---[FILE: base-git.interface.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/base-git.interface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IBaseGitSyncInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IBaseGitSyncInterface
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class GitSyncController implements IGitSyncController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitSyncController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class GitSyncModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitSyncModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationGitSyncRepository extends Repository<OrganizationGit...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationGitSyncRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class GitSyncService implements IGitSyncService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitSyncService
```

--------------------------------------------------------------------------------

---[FILE: source-control-provider.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/source-control-provider.ts
Signals: NestJS
Excerpt (<=80 chars): export class SourceControlProviderService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlProviderService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class OrganizationGitCreateDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationGitCreateDto
- OrganizationGitUpdateDto
- OrganizationGitStatusUpdateDto
- OrganizationGitHTTPSUpdateDto
```

--------------------------------------------------------------------------------

---[FILE: provider-config.dto.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/dto/provider-config.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class BaseConfigDTO {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseConfigDTO
- GithubSshConfigDTO
- GithubHttpsConfigDTO
- GitLabConfigDTO
- ProviderConfigDTO
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/Interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGitSyncController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IGitSyncController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/Interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGitSyncService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IGitSyncService
```

--------------------------------------------------------------------------------

````
