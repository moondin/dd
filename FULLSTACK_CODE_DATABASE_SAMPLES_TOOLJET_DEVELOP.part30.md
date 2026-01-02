---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 30
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 30 of 37)

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

---[FILE: listener.ts]---
Location: ToolJet-develop/server/src/modules/app-git/listener.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppVersionRenameListener {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppVersionRenameListener
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/app-git/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppGitModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppGitModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/app-git/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppGitRepository extends Repository<AppGitSync> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppGitRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/app-git/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppGitService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppGitService
```

--------------------------------------------------------------------------------

---[FILE: source-control-provider.ts]---
Location: ToolJet-develop/server/src/modules/app-git/source-control-provider.ts
Signals: NestJS
Excerpt (<=80 chars): export class SourceControlProviderService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlProviderService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/app-git/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app-git/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type AppGitAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppGitAbility
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app-git/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class AppGitCreateDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppGitCreateDto
- AppGitPushDto
- AppGitPullDto
- AppGitPullUpdateDto
- AppGitUpdateDto
- RenameAppOrVersionDto
```

--------------------------------------------------------------------------------

---[FILE: app-resource.guard.ts]---
Location: ToolJet-develop/server/src/modules/app-git/guards/app-resource.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppResourceGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppResourceGuard
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/app-git/providers/github-https/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class HTTPSAppGitService extends BaseGitSyncService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HTTPSAppGitService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/app-git/providers/github-https/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class HTTPSAppGitUtilityService extends BaseGitUtilService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HTTPSAppGitUtilityService
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/app-git/providers/github-ssh/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class SSHAppGitService extends BaseGitSyncService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSHAppGitService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/app-git/providers/github-ssh/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class SSHAppGitUtilityService extends BaseGitUtilService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSHAppGitUtilityService
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/app-git/providers/gitlab/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class GitLabAppGitService extends BaseGitSyncService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitLabAppGitService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/app-git/providers/gitlab/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class GitLabAppGitUtilityService extends BaseGitUtilService {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitLabAppGitUtilityService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class AppPermissionsController implements IAppPermissionsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppPermissionsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class AppPermissionsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppPermissionsModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppPermissionsService implements IAppPermissionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppPermissionsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppPermissionsUtilService implements IUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppPermissionsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreatePermissionDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatePermissionDto
```

--------------------------------------------------------------------------------

---[FILE: valid-app.guard.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/guards/valid-app.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class ValidAppGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidAppGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IAppPermissionsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppPermissionsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAppPermissionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppPermissionsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUtilService
```

--------------------------------------------------------------------------------

---[FILE: component-permissions.repository.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/repositories/component-permissions.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ComponentPermissionsRepository extends Repository<ComponentPermi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentPermissionsRepository
```

--------------------------------------------------------------------------------

---[FILE: component-users.repository.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/repositories/component-users.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ComponentUsersRepository extends Repository<ComponentUser> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentUsersRepository
```

--------------------------------------------------------------------------------

---[FILE: page-permissions.repository.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/repositories/page-permissions.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PagePermissionsRepository extends Repository<PagePermission> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PagePermissionsRepository
```

--------------------------------------------------------------------------------

---[FILE: page-users.repository.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/repositories/page-users.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PageUsersRepository extends Repository<PageUser> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageUsersRepository
```

--------------------------------------------------------------------------------

---[FILE: query-permissions.repository.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/repositories/query-permissions.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class QueryPermissionsRepository extends Repository<QueryPermission> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryPermissionsRepository
```

--------------------------------------------------------------------------------

---[FILE: query-users.repository.ts]---
Location: ToolJet-develop/server/src/modules/app-permissions/repositories/query-users.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class QueryUsersRepository extends Repository<QueryUser> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryUsersRepository
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/apps/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class AppsController implements IAppsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/apps/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppsModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/apps/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppsRepository extends Repository<App> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppsRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/apps/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppsService implements IAppsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/apps/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppsUtilService implements IAppsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppsUtilService
```

--------------------------------------------------------------------------------

---[FILE: app.ability.ts]---
Location: ToolJet-develop/server/src/modules/apps/ability/app.ability.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineAppAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineAppAbility
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/apps/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/apps/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utility.ts]---
Location: ToolJet-develop/server/src/modules/apps/ability/utility.ts
Signals: N/A
Excerpt (<=80 chars):  export function createAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createAbility
```

--------------------------------------------------------------------------------

---[FILE: workflow.ability.ts]---
Location: ToolJet-develop/server/src/modules/apps/ability/workflow.ability.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineWorkflowAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineWorkflowAbility
```

--------------------------------------------------------------------------------

---[FILE: workflow.controller.ts]---
Location: ToolJet-develop/server/src/modules/apps/controllers/workflow.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowController implements IWorkflowController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowController
```

--------------------------------------------------------------------------------

---[FILE: component.ts]---
Location: ToolJet-develop/server/src/modules/apps/dto/component.ts
Signals: N/A
Excerpt (<=80 chars):  export class ComponentLayoutDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentLayoutDto
- LayoutData
- LayoutUpdateDto
- CreateComponentDto
- UpdateComponentDto
- DeleteComponentDto
- BatchDiffDto
- BatchComponentsDto
```

--------------------------------------------------------------------------------

---[FILE: event.ts]---
Location: ToolJet-develop/server/src/modules/apps/dto/event.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateEventHandlerDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateEventHandlerDto
- UpdateEvent
- UpdateEventHandlerDto
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/apps/dto/index.ts
Signals: N/A
Excerpt (<=80 chars): export class AppCreateDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppCreateDto
- AppUpdateDto
- ValidateAppAccessDto
- ValidateAppAccessResponseDto
- AppListDto
- VersionReleaseDto
```

--------------------------------------------------------------------------------

---[FILE: page.ts]---
Location: ToolJet-develop/server/src/modules/apps/dto/page.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreatePageDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatePageDto
- DeletePageDto
- ReorderDiffDto
- ReorderPagesDto
- UpdatePageDto
```

--------------------------------------------------------------------------------

---[FILE: app-auth.guard.ts]---
Location: ToolJet-develop/server/src/modules/apps/guards/app-auth.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppAuthGuard extends AuthGuard('jwt') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: valid-app.guard.ts]---
Location: ToolJet-develop/server/src/modules/apps/guards/valid-app.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class ValidAppGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidAppGuard
```

--------------------------------------------------------------------------------

---[FILE: valid-slug.guard.ts]---
Location: ToolJet-develop/server/src/modules/apps/guards/valid-slug.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class ValidSlugGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidSlugGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IAppsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppsController
```

--------------------------------------------------------------------------------

---[FILE: IControllerWorkflow.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/IControllerWorkflow.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IWorkflowController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAppsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars): export interface IAppsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAppsUtilService
```

--------------------------------------------------------------------------------

---[FILE: IComponentService.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/services/IComponentService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IComponentsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IComponentsService
```

--------------------------------------------------------------------------------

---[FILE: IEventService.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/services/IEventService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IEventsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEventsService
```

--------------------------------------------------------------------------------

---[FILE: IPageService.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/services/IPageService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IPageService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPageService
```

--------------------------------------------------------------------------------

---[FILE: IPageUtilService.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/services/IPageUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars): export interface IPageHelperService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPageHelperService
```

--------------------------------------------------------------------------------

---[FILE: IWorkflowService.ts]---
Location: ToolJet-develop/server/src/modules/apps/interfaces/services/IWorkflowService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IWorkflowService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowService
```

--------------------------------------------------------------------------------

---[FILE: app-import-export.service.ts]---
Location: ToolJet-develop/server/src/modules/apps/services/app-import-export.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class AppImportExportService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertSinglePageSchemaToMultiPageSchema
- AppImportExportService
```

--------------------------------------------------------------------------------

---[FILE: component.service.ts]---
Location: ToolJet-develop/server/src/modules/apps/services/component.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ComponentsService implements IComponentsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentsService
```

--------------------------------------------------------------------------------

---[FILE: event.service.ts]---
Location: ToolJet-develop/server/src/modules/apps/services/event.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class EventsService implements IEventsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsService
```

--------------------------------------------------------------------------------

---[FILE: page.service.ts]---
Location: ToolJet-develop/server/src/modules/apps/services/page.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PageService implements IPageService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageService
```

--------------------------------------------------------------------------------

---[FILE: page.util.service.ts]---
Location: ToolJet-develop/server/src/modules/apps/services/page.util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PageHelperService implements IPageHelperService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageHelperService
```

--------------------------------------------------------------------------------

---[FILE: workflow.service.ts]---
Location: ToolJet-develop/server/src/modules/apps/services/workflow.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowService implements IWorkflowService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowService
```

--------------------------------------------------------------------------------

---[FILE: boundedBox.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/boundedBox.js
Signals: N/A
Excerpt (<=80 chars): export const boundedBoxConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- boundedBoxConfig
```

--------------------------------------------------------------------------------

---[FILE: button.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/button.js
Signals: N/A
Excerpt (<=80 chars): export const buttonConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buttonConfig
```

--------------------------------------------------------------------------------

---[FILE: buttonGroup.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/buttonGroup.js
Signals: N/A
Excerpt (<=80 chars): export const buttonGroupConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buttonGroupConfig
```

--------------------------------------------------------------------------------

---[FILE: calendar.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/calendar.js
Signals: N/A
Excerpt (<=80 chars): export const calendarConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calendarConfig
```

--------------------------------------------------------------------------------

---[FILE: chart.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/chart.js
Signals: N/A
Excerpt (<=80 chars): export const chartConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chartConfig
```

--------------------------------------------------------------------------------

---[FILE: chat.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/chat.js
Signals: N/A
Excerpt (<=80 chars): export const chatConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chatConfig
```

--------------------------------------------------------------------------------

---[FILE: checkbox.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/checkbox.js
Signals: N/A
Excerpt (<=80 chars): export const checkboxConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkboxConfig
```

--------------------------------------------------------------------------------

---[FILE: circularProgressbar.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/circularProgressbar.js
Signals: N/A
Excerpt (<=80 chars): export const circularProgressbarConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- circularProgressbarConfig
```

--------------------------------------------------------------------------------

---[FILE: codeEditor.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/codeEditor.js
Signals: N/A
Excerpt (<=80 chars): export const codeEditorConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- codeEditorConfig
```

--------------------------------------------------------------------------------

---[FILE: colorPicker.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/colorPicker.js
Signals: N/A
Excerpt (<=80 chars): export const colorPickerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- colorPickerConfig
```

--------------------------------------------------------------------------------

---[FILE: container.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/container.js
Signals: N/A
Excerpt (<=80 chars): export const containerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- containerConfig
```

--------------------------------------------------------------------------------

---[FILE: currencyinput.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/currencyinput.js
Signals: N/A
Excerpt (<=80 chars): export const currencyinputConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- currencyinputConfig
```

--------------------------------------------------------------------------------

---[FILE: customComponent.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/customComponent.js
Signals: N/A
Excerpt (<=80 chars): export const customComponentConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- customComponentConfig
```

--------------------------------------------------------------------------------

---[FILE: datepicker.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/datepicker.js
Signals: N/A
Excerpt (<=80 chars): export const datepickerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datepickerConfig
```

--------------------------------------------------------------------------------

---[FILE: datepickerV2.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/datepickerV2.js
Signals: N/A
Excerpt (<=80 chars): export const datePickerV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datePickerV2Config
```

--------------------------------------------------------------------------------

---[FILE: daterangepicker.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/daterangepicker.js
Signals: N/A
Excerpt (<=80 chars): export const daterangepickerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- daterangepickerConfig
```

--------------------------------------------------------------------------------

---[FILE: datetimepickerV2.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/datetimepickerV2.js
Signals: N/A
Excerpt (<=80 chars): export const datetimePickerV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datetimePickerV2Config
```

--------------------------------------------------------------------------------

---[FILE: divider.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/divider.js
Signals: N/A
Excerpt (<=80 chars): export const dividerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dividerConfig
```

--------------------------------------------------------------------------------

---[FILE: dropdown.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/dropdown.js
Signals: N/A
Excerpt (<=80 chars): export const dropdownConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dropdownConfig
```

--------------------------------------------------------------------------------

---[FILE: dropdownV2.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/dropdownV2.js
Signals: N/A
Excerpt (<=80 chars): export const dropdownV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dropdownV2Config
```

--------------------------------------------------------------------------------

---[FILE: emailinput.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/emailinput.js
Signals: N/A
Excerpt (<=80 chars): export const emailinputConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- emailinputConfig
```

--------------------------------------------------------------------------------

---[FILE: filepicker.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/filepicker.js
Signals: N/A
Excerpt (<=80 chars): export const filepickerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filepickerConfig
```

--------------------------------------------------------------------------------

---[FILE: form.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/form.js
Signals: N/A
Excerpt (<=80 chars): export const formConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formConfig
```

--------------------------------------------------------------------------------

---[FILE: html.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/html.js
Signals: N/A
Excerpt (<=80 chars): export const htmlConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- htmlConfig
```

--------------------------------------------------------------------------------

---[FILE: icon.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/icon.js
Signals: N/A
Excerpt (<=80 chars): export const iconConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- iconConfig
```

--------------------------------------------------------------------------------

---[FILE: iframe.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/iframe.js
Signals: N/A
Excerpt (<=80 chars): export const iframeConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- iframeConfig
```

--------------------------------------------------------------------------------

---[FILE: image.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/image.js
Signals: N/A
Excerpt (<=80 chars): export const imageConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- imageConfig
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/index.js
Signals: N/A
Excerpt (<=80 chars):  export const componentTypes = Object.values(widgets).map((widget) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- componentTypes
```

--------------------------------------------------------------------------------

---[FILE: kanban.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/kanban.js
Signals: N/A
Excerpt (<=80 chars): export const kanbanConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- kanbanConfig
```

--------------------------------------------------------------------------------

---[FILE: kanbanBoard.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/kanbanBoard.js
Signals: N/A
Excerpt (<=80 chars):  export const kanbanBoardConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- kanbanBoardConfig
```

--------------------------------------------------------------------------------

---[FILE: link.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/link.js
Signals: N/A
Excerpt (<=80 chars): export const linkConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- linkConfig
```

--------------------------------------------------------------------------------

---[FILE: listview.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/listview.js
Signals: N/A
Excerpt (<=80 chars): export const listviewConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- listviewConfig
```

--------------------------------------------------------------------------------

---[FILE: map.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/map.js
Signals: N/A
Excerpt (<=80 chars): export const mapConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapConfig
```

--------------------------------------------------------------------------------

---[FILE: modal.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/modal.js
Signals: N/A
Excerpt (<=80 chars): export const modalConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modalConfig
```

--------------------------------------------------------------------------------

---[FILE: modalV2.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/modalV2.js
Signals: N/A
Excerpt (<=80 chars): export const modalV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modalV2Config
```

--------------------------------------------------------------------------------

---[FILE: moduleContainer.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/moduleContainer.js
Signals: N/A
Excerpt (<=80 chars): export const moduleContainerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- moduleContainerConfig
```

--------------------------------------------------------------------------------

---[FILE: moduleViewer.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/moduleViewer.js
Signals: N/A
Excerpt (<=80 chars): export const moduleViewerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- moduleViewerConfig
```

--------------------------------------------------------------------------------

---[FILE: multiselect.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/multiselect.js
Signals: N/A
Excerpt (<=80 chars): export const multiselectConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multiselectConfig
```

--------------------------------------------------------------------------------

---[FILE: multiselectV2.js]---
Location: ToolJet-develop/server/src/modules/apps/services/widget-config/multiselectV2.js
Signals: N/A
Excerpt (<=80 chars): export const multiselectV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multiselectV2Config
```

--------------------------------------------------------------------------------

````
