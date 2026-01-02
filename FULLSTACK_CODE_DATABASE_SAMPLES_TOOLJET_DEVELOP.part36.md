---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 36
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 36 of 37)

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

---[FILE: tooljet-db-data-operations.service.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/services/tooljet-db-data-operations.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class TooljetDbDataOperationsService implements QueryService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbDataOperationsService
```

--------------------------------------------------------------------------------

---[FILE: tooljet-db-import-export.service.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/services/tooljet-db-import-export.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class TooljetDbImportExportService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbImportExportService
```

--------------------------------------------------------------------------------

---[FILE: tooljet-db-table-operations.service.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/services/tooljet-db-table-operations.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class TooljetDbTableOperationsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbTableOperationsService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/users/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class UsersController implements IUserController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/users/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class UsersModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/users/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class UsersService implements IUsersService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/users/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class UsersUtilService implements IUsersUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/users/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/users/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: lifecycle.ts]---
Location: ToolJet-develop/server/src/modules/users/constants/lifecycle.ts
Signals: NestJS
Excerpt (<=80 chars):  export const URL_SSO_SOURCE = 'sso';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getUserErrorMessages
- getUserStatusAndSource
- isPasswordMandatory
- URL_SSO_SOURCE
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/users/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateUserTypeDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateUserTypeDto
- UpdateUserTypeInstanceDto
- AllUserResponse
- ChangePasswordDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/users/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUserController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUserController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/users/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUsersService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUsersService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/users/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUsersUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUsersUtilService
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/users/repositories/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class UserRepository extends Repository<User> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserRepository
```

--------------------------------------------------------------------------------

---[FILE: UserPersonalAccessTokens.repository.ts]---
Location: ToolJet-develop/server/src/modules/users/repositories/UserPersonalAccessTokens.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class UserPersonalAccessTokenRepository extends Repository<UserPersona...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserPersonalAccessTokenRepository
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/versions/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class VersionController implements IVersionController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionController
```

--------------------------------------------------------------------------------

---[FILE: controller.v2.ts]---
Location: ToolJet-develop/server/src/modules/versions/controller.v2.ts
Signals: NestJS
Excerpt (<=80 chars): export class VersionControllerV2 implements IVersionControllerV2 {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionControllerV2
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/versions/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class VersionModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/versions/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class VersionRepository extends Repository<AppVersion> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/versions/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class VersionService implements IVersionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/versions/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class VersionUtilService implements IVersionUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionUtilService
```

--------------------------------------------------------------------------------

---[FILE: app-version.ability.ts]---
Location: ToolJet-develop/server/src/modules/versions/ability/app-version.ability.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineAppVersionAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineAppVersionAbility
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/versions/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/versions/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utility.ts]---
Location: ToolJet-develop/server/src/modules/versions/ability/utility.ts
Signals: N/A
Excerpt (<=80 chars):  export function createVersionAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createVersionAbility
```

--------------------------------------------------------------------------------

---[FILE: workflow-version.ability.ts]---
Location: ToolJet-develop/server/src/modules/versions/ability/workflow-version.ability.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineWorkflowVersionAbility(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineWorkflowVersionAbility
```

--------------------------------------------------------------------------------

---[FILE: components.controller.ts]---
Location: ToolJet-develop/server/src/modules/versions/controllers/components.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class ComponentsController implements IComponentsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentsController
```

--------------------------------------------------------------------------------

---[FILE: events.controller.ts]---
Location: ToolJet-develop/server/src/modules/versions/controllers/events.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class EventsController implements IEventsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsController
```

--------------------------------------------------------------------------------

---[FILE: pages.controller.ts]---
Location: ToolJet-develop/server/src/modules/versions/controllers/pages.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class PagesController implements IPagesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PagesController
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/versions/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class VersionCreateDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionCreateDto
- PromoteVersionDto
```

--------------------------------------------------------------------------------

---[FILE: validate-app-version.guard.ts]---
Location: ToolJet-develop/server/src/modules/versions/guards/validate-app-version.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class ValidateAppVersionGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateAppVersionGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars): export interface IVersionController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IVersionController
```

--------------------------------------------------------------------------------

---[FILE: IControllerV2.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/IControllerV2.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IVersionControllerV2 {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IVersionControllerV2
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IVersionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IVersionService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IVersionUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IVersionUtilService
```

--------------------------------------------------------------------------------

---[FILE: IComponentsController.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/controllers/IComponentsController.ts
Signals: N/A
Excerpt (<=80 chars): export interface IComponentsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IComponentsController
```

--------------------------------------------------------------------------------

---[FILE: IEventsController.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/controllers/IEventsController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IEventsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEventsController
```

--------------------------------------------------------------------------------

---[FILE: IPagesController.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/controllers/IPagesController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IPagesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPagesController
```

--------------------------------------------------------------------------------

---[FILE: ICreateService.ts]---
Location: ToolJet-develop/server/src/modules/versions/interfaces/services/ICreateService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IVersionsCreateService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IVersionsCreateService
```

--------------------------------------------------------------------------------

---[FILE: create.service.ts]---
Location: ToolJet-develop/server/src/modules/versions/services/create.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class VersionsCreateService implements IVersionsCreateService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionsCreateService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class WhiteLabellingController implements IWhiteLabellingController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhiteLabellingController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class WhiteLabellingModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhiteLabellingModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class WhiteLabellingRepository extends Repository<WhiteLabelling> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhiteLabellingRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class WhiteLabellingService implements IWhiteLabellingService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhiteLabellingService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class WhiteLabellingUtilService implements IWhiteLabellingUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhiteLabellingUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type WhiteLabellingAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhiteLabellingAbility
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/constant/index.ts
Signals: N/A
Excerpt (<=80 chars): export const DEFAULT_WHITE_LABELLING_SETTINGS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_WHITE_LABELLING_SETTINGS
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateWhiteLabellingDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateWhiteLabellingDto
```

--------------------------------------------------------------------------------

---[FILE: verifyOrgId.guard.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/guards/verifyOrgId.guard.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationIdSlugValidationGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationIdSlugValidationGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/Interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IWhiteLabellingController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWhiteLabellingController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/Interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IWhiteLabellingService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWhiteLabellingService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/white-labelling/Interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IWhiteLabellingUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWhiteLabellingUtilService
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/workflows/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowsModule
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/workflows/ability/app/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/workflows/ability/app/index.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflow-executions.controller.ts]---
Location: ToolJet-develop/server/src/modules/workflows/controllers/workflow-executions.controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class WorkflowExecutionsController implements IWorkflowExecutionContro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecutionsController
```

--------------------------------------------------------------------------------

---[FILE: workflow-schedules.controller.ts]---
Location: ToolJet-develop/server/src/modules/workflows/controllers/workflow-schedules.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowSchedulesController implements IWorkflowSchedulesControl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSchedulesController
```

--------------------------------------------------------------------------------

---[FILE: workflow-webhooks.controller.ts]---
Location: ToolJet-develop/server/src/modules/workflows/controllers/workflow-webhooks.controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class WorkflowWebhooksController implements IWorkflowWebhooksController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowWebhooksController
```

--------------------------------------------------------------------------------

---[FILE: workflows.controller.ts]---
Location: ToolJet-develop/server/src/modules/workflows/controllers/workflows.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowsController implements IWorkflowsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowsController
```

--------------------------------------------------------------------------------

---[FILE: ITemporalService.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/ITemporalService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ITemporalService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITemporalService
```

--------------------------------------------------------------------------------

---[FILE: IWorflowSchedulesController.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/IWorflowSchedulesController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IWorkflowSchedulesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowSchedulesController
```

--------------------------------------------------------------------------------

---[FILE: IWorkflowExecutionController.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/IWorkflowExecutionController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IWorkflowExecutionController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowExecutionController
```

--------------------------------------------------------------------------------

---[FILE: IWorkflowExecutionsService.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/IWorkflowExecutionsService.ts
Signals: Express
Excerpt (<=80 chars):  export interface IWorkflowExecutionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowExecutionsService
```

--------------------------------------------------------------------------------

---[FILE: IWorkflowSchedulesService.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/IWorkflowSchedulesService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IWorkflowSchedulesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowSchedulesService
```

--------------------------------------------------------------------------------

---[FILE: IWorkflowsController.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/IWorkflowsController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IWorkflowsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowsController
```

--------------------------------------------------------------------------------

---[FILE: IWorkflowWebhooksController.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/IWorkflowWebhooksController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IWorkflowWebhooksController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowWebhooksController
```

--------------------------------------------------------------------------------

---[FILE: IWorkflowWebhooksService.ts]---
Location: ToolJet-develop/server/src/modules/workflows/interfaces/IWorkflowWebhooksService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IWorkflowWebhooksService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IWorkflowWebhooksService
```

--------------------------------------------------------------------------------

---[FILE: app-actions.listener.ts]---
Location: ToolJet-develop/server/src/modules/workflows/listeners/app-actions.listener.ts
Signals: NestJS
Excerpt (<=80 chars): export class AppsActionsListener {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppsActionsListener
```

--------------------------------------------------------------------------------

---[FILE: workflow-triggers.listener.ts]---
Location: ToolJet-develop/server/src/modules/workflows/listeners/workflow-triggers.listener.ts
Signals: NestJS, Express, TypeORM
Excerpt (<=80 chars):  export const WORKFLOW_EXECUTION_STATUS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WORKFLOW_EXECUTION_STATUS
- WorkflowTriggersListener
```

--------------------------------------------------------------------------------

---[FILE: workflow-webhooks.listener.ts]---
Location: ToolJet-develop/server/src/modules/workflows/listeners/workflow-webhooks.listener.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowWebhooksListener {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowWebhooksListener
```

--------------------------------------------------------------------------------

---[FILE: temporal.service.ts]---
Location: ToolJet-develop/server/src/modules/workflows/services/temporal.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class TemporalService implements ITemporalService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemporalService
```

--------------------------------------------------------------------------------

---[FILE: workflow-executions.service.ts]---
Location: ToolJet-develop/server/src/modules/workflows/services/workflow-executions.service.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class WorkflowExecutionsService implements IWorkflowExecutionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecutionsService
```

--------------------------------------------------------------------------------

---[FILE: workflow-schedules.service.ts]---
Location: ToolJet-develop/server/src/modules/workflows/services/workflow-schedules.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class WorkflowSchedulesService implements IWorkflowSchedulesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSchedulesService
```

--------------------------------------------------------------------------------

---[FILE: workflow-stream.service.ts]---
Location: ToolJet-develop/server/src/modules/workflows/services/workflow-stream.service.ts
Signals: NestJS
Excerpt (<=80 chars):  export const WORKFLOW_CONNECTION_TYPES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WORKFLOW_CONNECTION_TYPES
- WorkflowStreamService
```

--------------------------------------------------------------------------------

---[FILE: workflow-webhooks.service.ts]---
Location: ToolJet-develop/server/src/modules/workflows/services/workflow-webhooks.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class WorkflowWebhooksService implements IWorkflowWebhooksService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowWebhooksService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/templates/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const TemplateAppManifests = getTemplateManifests();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplateAppManifests
```

--------------------------------------------------------------------------------

---[FILE: test.helper.ts]---
Location: ToolJet-develop/server/test/test.helper.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export function authHeaderForUser(user: User, organizationId?: string, isPas...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authHeaderForUser
- generateRedirectUrl
- createSSOMockConfig
- verifyInviteToken
- setUpAccountFromToken
- getPathFromUrl
- createFirstUser
- generateAppDefaults
- getAppWithAllDetails
- authenticateUser
- logoutUser
- getAppEnvironment
- getWorkflowWebhookApiToken
- enableWebhookForWorkflows
- triggerWorkflowViaWebhook
- enableWorkflowStatus
```

--------------------------------------------------------------------------------

---[FILE: tooljet-db-test.helper.ts]---
Location: ToolJet-develop/server/test/tooljet-db-test.helper.ts
Signals: TypeORM
Excerpt (<=80 chars): import { EntityManager } from 'typeorm';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: app.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/app.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): /* eslint-disable @typescript-eslint/no-unused-vars */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: apps.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/apps.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: app_users.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/app_users.e2e-spec.ts
Signals: NestJS
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: audit_logs.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/audit_logs.e2e-spec.ts
Signals: NestJS
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: comment.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/comment.e2e-spec.ts
Signals: NestJS
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: data_queries.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/data_queries.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: data_sources.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/data_sources.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: files.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/files.e2e-spec.ts
Signals: NestJS
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: folders.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/folders.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: folder_apps.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/folder_apps.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import { INestApplication } from '@nestjs/common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: group_permissions.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/group_permissions.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: import_export_resources.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/import_export_resources.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: instance_settings.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/instance_settings.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): /* eslint-disable @typescript-eslint/no-unused-vars */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: library_apps.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/library_apps.e2e-spec.ts
Signals: NestJS
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: organizations.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/organizations.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): import * as request from 'supertest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: organization_users.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/organization_users.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): /* eslint-disable @typescript-eslint/no-unused-vars */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: org_constants.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/org_constants.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): /* eslint-disable @typescript-eslint/no-unused-vars */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: org_environment_variables.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/org_environment_variables.e2e-spec.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): /* eslint-disable @typescript-eslint/no-unused-vars */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: session.e2e-spec.ts]---
Location: ToolJet-develop/server/test/controllers/session.e2e-spec.ts
Signals: NestJS
Excerpt (<=80 chars): import { INestApplication } from '@nestjs/common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
