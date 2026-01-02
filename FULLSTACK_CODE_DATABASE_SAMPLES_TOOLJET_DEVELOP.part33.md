---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 33
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 33 of 37)

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

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/providers/github-https/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class HTTPSGitSyncService extends BaseGitSyncService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HTTPSGitSyncService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/providers/github-https/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class HTTPSGitSyncUtilityService extends BaseGitUtilService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HTTPSGitSyncUtilityService
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/providers/github-ssh/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class SSHGitSyncService extends BaseGitSyncService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSHGitSyncService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/providers/github-ssh/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class SSHGitSyncUtilityService extends BaseGitUtilService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSHGitSyncUtilityService
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/providers/gitlab/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class GitLabGitSyncService extends BaseGitSyncService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitLabGitSyncService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/git-sync/providers/gitlab/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class GitLabGitSyncUtilityService extends BaseGitUtilService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitLabGitSyncUtilityService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class GroupPermissionsControllerV2 implements IGroupPermissionsControl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupPermissionsControllerV2
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class GroupPermissionsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupPermissionsModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class GroupPermissionsRepository extends Repository<GroupPermissions> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupPermissionsRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class GroupPermissionsService implements IGroupPermissionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupPermissionsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class GroupPermissionsUtilService implements IGroupPermissionsUtilServ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupPermissionsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: error.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/constants/error.ts
Signals: N/A
Excerpt (<=80 chars):  export const ERROR_HANDLER = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ERROR_HANDLER
- DATA_BASE_CONSTRAINTS
```

--------------------------------------------------------------------------------

---[FILE: granular_permissions.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/constants/granular_permissions.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_GRANULAR_PERMISSIONS_NAME = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_GRANULAR_PERMISSIONS_NAME
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const HUMANIZED_USER_LIST = ['End-user', 'Builder', 'Admin'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HUMANIZED_USER_LIST
- DEFAULT_GROUP_PERMISSIONS
- DEFAULT_RESOURCE_PERMISSIONS
```

--------------------------------------------------------------------------------

---[FILE: granular-permissions.controller.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/controllers/granular-permissions.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class GranularPermissionsController implements IGranularPermissionsCon...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GranularPermissionsController
```

--------------------------------------------------------------------------------

---[FILE: group.decorator.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/decorators/group.decorator.ts
Signals: NestJS
Excerpt (<=80 chars):  export const Group = createParamDecorator((data: unknown, ctx: ExecutionCont...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Group
```

--------------------------------------------------------------------------------

---[FILE: granular-permissions.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/dto/granular-permissions.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateGranularPermissionDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateGranularPermissionDto
- UpdateGranularPermissionDto
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateGroupPermissionDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateGroupPermissionDto
- UpdateGroupPermissionDto
- AddGroupUserDto
- DuplicateGroupDtoBase
- DuplicateGroupDto
```

--------------------------------------------------------------------------------

---[FILE: group-existance.guard.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/guards/group-existance.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class GroupExistenceGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupExistenceGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGroupPermissionsControllerV2 {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IGroupPermissionsControllerV2
- IGranularPermissionsController
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/interfaces/index.ts
Signals: N/A
Excerpt (<=80 chars): export interface ValidateEditUserGroupAdditionObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateEditUserGroupAdditionObject
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IGranularPermissionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IGranularPermissionsService
- IGroupPermissionsDuplicateService
- IGroupPermissionsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IGroupPermissionsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IGroupPermissionsUtilService
- IGranularPermissionsUtilService
- IGroupPermissionsLicenseUtilService
```

--------------------------------------------------------------------------------

---[FILE: duplicate.service.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/services/duplicate.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class GroupPermissionsDuplicateService implements IGroupPermissionsDup...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupPermissionsDuplicateService
```

--------------------------------------------------------------------------------

---[FILE: granular-permissions.service.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/services/granular-permissions.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class GranularPermissionsService implements IGranularPermissionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GranularPermissionsService
```

--------------------------------------------------------------------------------

---[FILE: granular_permissions.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/types/granular_permissions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AddableResourceItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateResourcePermissionObject
- GranularPermissionAddResourceItems
- GranularPermissionDeleteResourceItems
- ResourceGroupActions
- AddableResourceItem
- CreateBaseAppsPermissionsObject
- CreateAppsPermissionsObject
- CreateWorkflowPermissionsObject
- CreateDataSourcePermissionsObject
- DataSourcesGroupPermissionsActions
- CreateGranularPermissionObject
- AppsPermissionAddResourceItem
- WorkflowsPermissionAddResourceItem
- DataSourcesPermissionResourceItem
- AppsGroupPermissionsActions
- WorkflowsGroupPermissionsActions
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/types/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CreateDefaultGroupObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateDefaultGroupObject
- GranularPermissionQuerySearchParam
- GetUsersResponse
- UpdateGroupObject
- AddUserRoleObject
```

--------------------------------------------------------------------------------

---[FILE: granular-permissions.util.service.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/util-services/granular-permissions.util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class GranularPermissionsUtilService implements IGranularPermissionsUt...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GranularPermissionsUtilService
```

--------------------------------------------------------------------------------

---[FILE: license.util.service.ts]---
Location: ToolJet-develop/server/src/modules/group-permissions/util-services/license.util.service.ts
Signals: N/A
Excerpt (<=80 chars):  export class GroupPermissionLicenseUtilService implements IGroupPermissionsL...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GroupPermissionLicenseUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/import-export-resources/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class ImportExportResourcesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportExportResourcesController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/import-export-resources/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class ImportExportResourcesModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportExportResourcesModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/import-export-resources/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class ImportExportResourcesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportExportResourcesService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/import-export-resources/ability/app/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/import-export-resources/ability/app/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/import-export-resources/ability/data-source/guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/import-export-resources/ability/data-source/index.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: in-memory-cache.service.ts]---
Location: ToolJet-develop/server/src/modules/inMemoryCache/in-memory-cache.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class InMemoryCacheService implements ICacheService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InMemoryCacheService
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/inMemoryCache/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class InMemoryCacheModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InMemoryCacheModule
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/inMemoryCache/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars): export interface ICacheService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICacheService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class InstanceSettingsController implements IInstanceSettingsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceSettingsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class InstanceSettingsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceSettingsModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class InstanceSettingsService implements IInstanceSettingsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceSettingsService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FeaturesConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateSystemSettingsDto
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class InstanceSettingsUtilService implements IInstanceSettingsUtilServ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceSettingsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const INSTANCE_CONFIGS_DATA_TYPES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefaultInstanceSettings
- INSTANCE_CONFIGS_DATA_TYPES
- INSTANCE_SETTINGS_ENCRYPTION_KEY
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateInstanceSettingsDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInstanceSettingsDto
- UpdateUserSettingsDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/Interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IInstanceSettingsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IInstanceSettingsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/Interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IInstanceSettingsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IInstanceSettingsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/instance-settings/Interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IInstanceSettingsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IInstanceSettingsUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/licensing/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseController implements ILicenseController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseController
```

--------------------------------------------------------------------------------

---[FILE: helper.ts]---
Location: ToolJet-develop/server/src/modules/licensing/helper.ts
Signals: N/A
Excerpt (<=80 chars):  export function generatePayloadForLimits(currentCount: number, totalCount: a...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generatePayloadForLimits
- getLicenseFieldValue
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/licensing/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/licensing/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LicenseRepository {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseService implements ILicenseService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseUtilService implements ILicenseUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/licensing/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/licensing/constants/index.ts
Signals: N/A
Excerpt (<=80 chars): export const PLAN_DETAILS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PLAN_DETAILS
- LICENSE_TRIAL_API
- ORGANIZATION_INSTANCE_KEY
```

--------------------------------------------------------------------------------

---[FILE: PlanTerms.ts]---
Location: ToolJet-develop/server/src/modules/licensing/constants/PlanTerms.ts
Signals: N/A
Excerpt (<=80 chars):  export const BASIC_PLAN_TERMS: Partial<Terms> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BASIC_PLAN_SETTINGS
- CLOUD_EDITION_SETTINGS
- BUSINESS_PLAN_TERMS
- ENTERPRISE_PLAN_TERMS
```

--------------------------------------------------------------------------------

---[FILE: apps.controller.ts]---
Location: ToolJet-develop/server/src/modules/licensing/controllers/apps.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseAppsController implements ILicenseAppsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseAppsController
```

--------------------------------------------------------------------------------

---[FILE: audit-logs.controller.ts]---
Location: ToolJet-develop/server/src/modules/licensing/controllers/audit-logs.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseAuditLogsController implements IAuditLogLicenseController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseAuditLogsController
```

--------------------------------------------------------------------------------

---[FILE: organization.controller.ts]---
Location: ToolJet-develop/server/src/modules/licensing/controllers/organization.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseOrganizationController implements ILicenseOrganizationCon...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseOrganizationController
```

--------------------------------------------------------------------------------

---[FILE: plans.controller.ts]---
Location: ToolJet-develop/server/src/modules/licensing/controllers/plans.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicensePlansController implements ILicensePlansController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicensePlansController
```

--------------------------------------------------------------------------------

---[FILE: user.controller.ts]---
Location: ToolJet-develop/server/src/modules/licensing/controllers/user.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseUserController implements ILicenseUserController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseUserController
```

--------------------------------------------------------------------------------

---[FILE: workflows.controller.ts]---
Location: ToolJet-develop/server/src/modules/licensing/controllers/workflows.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseWorkflowsController implements ILicenseWorkflowsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseWorkflowsController
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/licensing/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class LicenseUpdateDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseUpdateDto
```

--------------------------------------------------------------------------------

---[FILE: app.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/app.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppCountGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppCountGuard
```

--------------------------------------------------------------------------------

---[FILE: auditLog.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/auditLog.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class AuditLogsDurationGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuditLogsDurationGuard
```

--------------------------------------------------------------------------------

---[FILE: editorUser.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/editorUser.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class EditorUserCountGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditorUserCountGuard
```

--------------------------------------------------------------------------------

---[FILE: feature.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/feature.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FeatureGuard
```

--------------------------------------------------------------------------------

---[FILE: sso.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/sso.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class SSOGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSOGuard
```

--------------------------------------------------------------------------------

---[FILE: table.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/table.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class TableCountGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableCountGuard
```

--------------------------------------------------------------------------------

---[FILE: user.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/user.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class UserCountGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserCountGuard
```

--------------------------------------------------------------------------------

---[FILE: webhook.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/webhook.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class WebhookGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookGuard
```

--------------------------------------------------------------------------------

---[FILE: workflow.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/workflow.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class WorkflowGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowGuard
```

--------------------------------------------------------------------------------

---[FILE: workflowcount.guard.ts]---
Location: ToolJet-develop/server/src/modules/licensing/guards/workflowcount.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowCountGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowCountGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/licensing/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ILicenseController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILicenseController
- ILicenseAppsController
- IAuditLogLicenseController
- ILicenseOrganizationController
- ILicenseWorkflowsController
- ILicenseUserController
- ILicensePlansController
- ILicenseAuditLogsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/licensing/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface ILicenseWorkflowsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILicenseWorkflowsService
- ILicenseUserService
- ILicenseOrganizationService
- ILicenseDecryptService
- ILicenseCountsService
- ILicenseAppsService
- ILicenseService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/licensing/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ILicenseUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILicenseUtilService
```

--------------------------------------------------------------------------------

---[FILE: terms.ts]---
Location: ToolJet-develop/server/src/modules/licensing/interfaces/terms.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Terms {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Terms
```

--------------------------------------------------------------------------------

---[FILE: apps.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/apps.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LicenseAppsService implements ILicenseAppsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseAppsService
```

--------------------------------------------------------------------------------

---[FILE: count.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/count.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LicenseCountsService implements ILicenseCountsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseCountsService
```

--------------------------------------------------------------------------------

---[FILE: decrypt.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/decrypt.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseDecryptService implements ILicenseDecryptService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseDecryptService
```

--------------------------------------------------------------------------------

---[FILE: init.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/init.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LicenseInitService extends ILicenseInitService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseInitService
```

--------------------------------------------------------------------------------

---[FILE: organization.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/organization.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LicenseOrganizationService implements ILicenseOrganizationService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseOrganizationService
```

--------------------------------------------------------------------------------

---[FILE: terms.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/terms.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class LicenseTermsService extends ILicenseTermsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseTermsService
```

--------------------------------------------------------------------------------

---[FILE: user.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/user.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LicenseUserService implements ILicenseUserService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseUserService
```

--------------------------------------------------------------------------------

---[FILE: workflows.service.ts]---
Location: ToolJet-develop/server/src/modules/licensing/services/workflows.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LicenseWorkflowsService implements ILicenseWorkflowsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseWorkflowsService
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/log-to-file/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class LogToFileModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogToFileModule
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/log-to-file/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const logFileTransportConfig = (filePath, processId) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- logFileTransportConfig
- logFormat
- readObjectFromLines
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class LoginConfigsController implements ILoginConfigsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginConfigsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class LoginConfigsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginConfigsModule
```

--------------------------------------------------------------------------------

````
