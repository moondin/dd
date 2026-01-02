---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 35
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 35 of 37)

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

---[FILE: user-details.service.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/services/user-details.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class UserDetailsService implements IUserDetailsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserDetailsService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/types/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FeaturesConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FetchUserResponse
- UserFilterOptions
- InvitedUserType
- RoleUpdate
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/organizations/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationsController implements IOrganizationsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/organizations/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class OrganizationsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationsModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/organizations/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationRepository extends Repository<Organization> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/organizations/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationsService implements IOrganizationsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/organizations/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationsUtilService implements IOrganizationUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/organizations/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organizations/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type OrganizationAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationAbility
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organizations/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const ERROR_HANDLER = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ERROR_HANDLER
- ERROR_HANDLER_TITLE
- CONSTRAINTS
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organizations/dto/index.ts
Signals: N/A
Excerpt (<=80 chars): export class AllowedCharactersValidator implements ValidatorConstraintInterfa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AllowedCharactersValidator
- OrganizationCreateDto
- OrganizationUpdateDto
- OrganizationStatusUpdateDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/organizations/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IOrganizationsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/organizations/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IOrganizationsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationWithPlan
- IOrganizationsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/organizations/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IOrganizationUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/plugins/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class PluginsController implements IPluginsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/plugins/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class PluginsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginsModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/plugins/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PluginsRepository extends Repository<Plugin> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginsRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/plugins/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PluginsService implements IPluginsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/plugins/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PluginsUtilService implements IPluginsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/plugins/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/plugins/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/plugins/dto/index.ts
Signals: NestJS
Excerpt (<=80 chars):  export class CreatePluginDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatePluginDto
- UpdatePluginDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/plugins/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IPluginsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPluginsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/plugins/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IPluginsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPluginsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/plugins/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IPluginsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPluginsUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/profile/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class ProfileController implements IProfileController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/profile/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class ProfileModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/profile/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ProfileService implements IProfileService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/profile/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class ProfileUtilService implements IProfileUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/profile/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/profile/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type OrganizationAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationAbility
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/profile/constants/index.ts
Signals: N/A
Excerpt (<=80 chars): export const MAX_AVATAR_FILE_SIZE = 1024 * 1024 * 2; // 2MB

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_AVATAR_FILE_SIZE
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/profile/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class ProfileUpdateDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfileUpdateDto
```

--------------------------------------------------------------------------------

---[FILE: password-revalidate.guard.ts]---
Location: ToolJet-develop/server/src/modules/profile/guards/password-revalidate.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class PasswordRevalidateGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordRevalidateGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/profile/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IProfileController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IProfileController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/profile/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IProfileService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IProfileService
- IProfileUtilService
```

--------------------------------------------------------------------------------

---[FILE: middleware.ts]---
Location: ToolJet-develop/server/src/modules/request-context/middleware.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class RequestContextMiddleware implements NestMiddleware<Request, Resp...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestContextMiddleware
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/request-context/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class RequestContextModule implements NestModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestContextModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/request-context/service.ts
Signals: Express
Excerpt (<=80 chars):  export class RequestContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestContext
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/roles/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class RolesController implements IRolesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RolesController
```

--------------------------------------------------------------------------------

---[FILE: dto.ts]---
Location: ToolJet-develop/server/src/modules/roles/dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class EditUserRoleDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditUserRoleDto
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/roles/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class RolesModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RolesModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/roles/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class RolesRepository extends Repository<GroupPermissions> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RolesRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/roles/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class RolesService implements IRolesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RolesService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/roles/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class RolesUtilService implements IRolesUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RolesUtilService
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/roles/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars): export interface IRolesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IRolesController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/roles/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IRolesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IRolesService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/roles/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IRolesUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IRolesUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/session/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class SessionController implements ISessionController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/session/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class SessionModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/session/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class UserSessionRepository extends Repository<UserSessions> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserSessionRepository
```

--------------------------------------------------------------------------------

---[FILE: scheduler.ts]---
Location: ToolJet-develop/server/src/modules/session/scheduler.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class SessionScheduler {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionScheduler
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/session/service.ts
Signals: NestJS, Express, TypeORM
Excerpt (<=80 chars): export class SessionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/session/util.service.ts
Signals: NestJS, Express, TypeORM
Excerpt (<=80 chars): export class SessionUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/session/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/session/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type OrganizationAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationAbility
```

--------------------------------------------------------------------------------

---[FILE: invited-user.decorator.ts]---
Location: ToolJet-develop/server/src/modules/session/decorators/invited-user.decorator.ts
Signals: NestJS
Excerpt (<=80 chars):  export const InvitedUser = createParamDecorator((data: unknown, ctx: Executi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvitedUser
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/session/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvitedUserSessionDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvitedUserSessionDto
```

--------------------------------------------------------------------------------

---[FILE: invited-user-session.guard.ts]---
Location: ToolJet-develop/server/src/modules/session/guards/invited-user-session.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class InvitedUserSessionAuthGuard extends AuthGuard('jwt') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvitedUserSessionAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: jwt-auth.guard.ts]---
Location: ToolJet-develop/server/src/modules/session/guards/jwt-auth.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class JwtAuthGuard extends AuthGuard('jwt') {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JwtAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: organization-auth.guard.ts]---
Location: ToolJet-develop/server/src/modules/session/guards/organization-auth.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationAuthGuard extends AuthGuard('jwt') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: organizations-list-auth.guard.ts]---
Location: ToolJet-develop/server/src/modules/session/guards/organizations-list-auth.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationsListAuthGuard extends OrganizationAuthGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationsListAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: session-auth-guard.ts]---
Location: ToolJet-develop/server/src/modules/session/guards/session-auth-guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class SessionAuthGuard extends AuthGuard('jwt') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/session/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface ISessionController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISessionController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/session/interfaces/IService.ts
Signals: Express, TypeORM
Excerpt (<=80 chars):  export interface ISessionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISessionService
- ISessionUtilService
- JWTPayload
```

--------------------------------------------------------------------------------

---[FILE: jwt.strategy.ts]---
Location: ToolJet-develop/server/src/modules/session/jwt/jwt.strategy.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class JwtStrategy extends PassportStrategy(Strategy) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JwtStrategy
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/session/types/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type JWTPayload = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JWTPayload
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class SetupOrganizationsController implements ISetupOrganizationsContr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetupOrganizationsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class SetupOrganizationsModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetupOrganizationsModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class SetupOrganizationsService implements ISetupOrganizationsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetupOrganizationsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class SetupOrganizationsUtilService implements ISetupOrganizationsUtil...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetupOrganizationsUtilService
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface ISetupOrganizationsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISetupOrganizationsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface ISetupOrganizationsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISetupOrganizationsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface ISetupOrganizationsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISetupOrganizationsUtilService
```

--------------------------------------------------------------------------------

---[FILE: organization-inputs.ts]---
Location: ToolJet-develop/server/src/modules/setup-organization/types/organization-inputs.ts
Signals: N/A
Excerpt (<=80 chars): export interface OrganizationInputs {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationInputs
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/smtp/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class SmtpController implements SmtpControllerInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SmtpController
```

--------------------------------------------------------------------------------

---[FILE: dto.ts]---
Location: ToolJet-develop/server/src/modules/smtp/dto.ts
Signals: N/A
Excerpt (<=80 chars): export class UpdateSMTPSettingsDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateSMTPSettingsDto
- UpdateSmtpEnvSettingChangedDto
- UpdateSmtpStatusChangedDto
- ListSMTPDto
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/smtp/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class SMTPModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SMTPModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/smtp/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class SMTPService implements SMTPServiceInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SMTPService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/smtp/util.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class SMTPUtilService implements ISMTPUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SMTPUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/smtp/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/smtp/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/smtp/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SmtpControllerInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SmtpControllerInterface
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/smtp/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SMTPServiceInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SMTPServiceInterface
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/smtp/interfaces/IUtilService.ts
Signals: N/A
Excerpt (<=80 chars): export interface ISMTPUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISMTPUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/templates/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class TemplateAppsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplateAppsController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/templates/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class TemplatesModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplatesModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/templates/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class TemplatesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplatesService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/templates/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/templates/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class TooljetDbController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbController
```

--------------------------------------------------------------------------------

---[FILE: helper.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/helper.ts
Signals: TypeORM
Excerpt (<=80 chars): import { EntityManager } from 'typeorm';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/module.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export class TooljetDbModule extends SubModule implements OnModuleInit {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class InternalTableRepository extends Repository<InternalTable> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InternalTableRepository
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/types.ts
Signals: TypeORM
Excerpt (<=80 chars):  export const TJDB = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TJDB
- PostgrestError
- TooljetDatabaseError
- TooljetDatabaseDataTypes
- TooljetDatabaseColumn
- TooljetDatabaseForeignKey
- TooljetDatabaseTable
- TooljetDbActions
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/ability/index.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export function Match(property: string, validationOptions?: ValidationOption...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Match
- MatchTypeConstraint
- SQLInjectionValidator
- ConstraintTypeDto
- CreatePostgrestTableDto
- PostgrestForeignKeyDto
- PostgrestTableColumnDto
- EditTableColumnsDto
- EditTableDto
- EditColumnTableDto
- AddColumnDto
```

--------------------------------------------------------------------------------

---[FILE: join.dto.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/dto/join.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class TooljetDbJoinDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbJoinDto
```

--------------------------------------------------------------------------------

---[FILE: tooljetdb-exception-filter.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/filters/tooljetdb-exception-filter.ts
Signals: NestJS
Excerpt (<=80 chars): export class TooljetDbExceptionFilter implements ExceptionFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbExceptionFilter
```

--------------------------------------------------------------------------------

---[FILE: tooljetdb-join-exceptions-filter.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/filters/tooljetdb-join-exceptions-filter.ts
Signals: NestJS
Excerpt (<=80 chars): export class TooljetDbJoinExceptionFilter implements ExceptionFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbJoinExceptionFilter
```

--------------------------------------------------------------------------------

---[FILE: postgrest-proxy.service.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/services/postgrest-proxy.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class PostgrestProxyService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PostgrestProxyService
```

--------------------------------------------------------------------------------

---[FILE: tooljet-db-bulk-upload.service.ts]---
Location: ToolJet-develop/server/src/modules/tooljet-db/services/tooljet-db-bulk-upload.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class TooljetDbBulkUploadService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooljetDbBulkUploadService
```

--------------------------------------------------------------------------------

````
