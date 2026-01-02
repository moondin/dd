---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 34
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 34 of 37)

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

---[FILE: oidc-group-sync.repository.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/oidc-group-sync.repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class SsoConfigOidcGroupSyncRepository extends Repository<SsoConfigOid...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SsoConfigOidcGroupSyncRepository
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class SSOConfigsRepository extends Repository<SSOConfigs> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSOConfigsRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class LoginConfigsService implements ILoginConfigsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginConfigsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class LoginConfigsUtilService implements ILoginConfigsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginConfigsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class OrganizationConfigsUpdateDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationConfigsUpdateDto
- InstanceConfigsUpdateDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ILoginConfigsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILoginConfigsController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SSOConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSOConfig
- ILoginConfigsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilsService.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/interfaces/IUtilsService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface ILoginConfigsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILoginConfigsUtilService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/login-configs/types/index.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface InstanceSSOConfigMap {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceSSOConfigMap
- SSOConfig
- ILoginConfigsService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/meta/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class MetadataController implements IMetadataController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetadataController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/meta/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class MetaModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetaModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/meta/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class MetadataService implements IMetaService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetadataService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/meta/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class MetadataUtilService implements IMetaUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetadataUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/meta/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/meta/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/meta/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars): export interface IMetadataController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IMetadataController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/meta/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars): export interface IMetaService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IMetaService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/meta/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars): export interface IMetaUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IMetaUtilService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/meta/types/index.ts
Signals: N/A
Excerpt (<=80 chars): export interface MetadataType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FinishInstallationParams
- MetadataType
- MetaDataInfo
```

--------------------------------------------------------------------------------

---[FILE: IModulesController.ts]---
Location: ToolJet-develop/server/src/modules/modules/IModulesController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IModulesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IModulesController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/modules/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class ModulesModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModulesModule
```

--------------------------------------------------------------------------------

---[FILE: modules.controller.ts]---
Location: ToolJet-develop/server/src/modules/modules/modules.controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class ModulesController implements IModulesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModulesController
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/modules/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/modules/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: interceptor.ts]---
Location: ToolJet-develop/server/src/modules/observability/sentry/interceptor.ts
Signals: NestJS
Excerpt (<=80 chars): export class SentryInterceptor implements NestInterceptor {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SentryInterceptor
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/observability/sentry/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export const SENTRY_OPTIONS = 'SENTRY_OPTIONS';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SENTRY_OPTIONS
- SentryModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/observability/sentry/service.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class SentryService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SentryService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class OnboardingController implements IOnboardingController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnboardingController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class OnboardingModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnboardingModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/service.ts
Signals: NestJS, Express, TypeORM
Excerpt (<=80 chars): export class OnboardingService implements IOnboardingService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnboardingService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/util.service.ts
Signals: NestJS, Express, TypeORM
Excerpt (<=80 chars): export class OnboardingUtilService implements IOnboardingUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnboardingUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: accept-organization-invite.dto.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/dto/accept-organization-invite.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class AcceptInviteDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AcceptInviteDto
```

--------------------------------------------------------------------------------

---[FILE: activate-account-with-token.dto.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/dto/activate-account-with-token.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class ActivateAccountWithTokenDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActivateAccountWithTokenDto
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class OnboardingCompletedDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnboardingCompletedDto
```

--------------------------------------------------------------------------------

---[FILE: resend-invite.dto.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/dto/resend-invite.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class ResendInviteDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResendInviteDto
```

--------------------------------------------------------------------------------

---[FILE: user.dto.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/dto/user.dto.ts
Signals: NestJS
Excerpt (<=80 chars):  export class CreateUserDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateUserDto
- TelemetryDataDto
- CreateAdminDto
- OnboardUserDto
- UpdateUserTypeDto
- UpdateUserDto
- TrialUserDto
- AllUserResponse
```

--------------------------------------------------------------------------------

---[FILE: first-user-signup-disable.guard.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/guards/first-user-signup-disable.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FirstUserSignupDisableGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FirstUserSignupDisableGuard
```

--------------------------------------------------------------------------------

---[FILE: first-user-signup.guard.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/guards/first-user-signup.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FirstUserSignupGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FirstUserSignupGuard
```

--------------------------------------------------------------------------------

---[FILE: organization-invite-auth.guard.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/guards/organization-invite-auth.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationInviteAuthGuard extends AuthGuard('jwt') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationInviteAuthGuard
```

--------------------------------------------------------------------------------

---[FILE: personal-workspace.guard.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/guards/personal-workspace.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class AllowPersonalWorkspaceGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AllowPersonalWorkspaceGuard
```

--------------------------------------------------------------------------------

---[FILE: signup-disable.guard.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/guards/signup-disable.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class SignupDisableGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SignupDisableGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IOnboardingController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOnboardingController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/interfaces/IService.ts
Signals: Express
Excerpt (<=80 chars):  export interface IOnboardingService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOnboardingService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/interfaces/IUtilService.ts
Signals: Express, TypeORM
Excerpt (<=80 chars): export interface IOnboardingUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOnboardingUtilService
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/onboarding/types/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FeaturesConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserOnboardingDetails
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationConstantController implements IOrganizationConstantC...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationConstantController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationConstantModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationConstantModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationConstantRepository extends Repository<OrganizationCo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationConstantRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationConstantsService implements IOrganizationConstantsSe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationConstantsService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationConstantsUtilService implements IOrganizationConstan...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationConstantsUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type OrganizationConstantAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationConstantAbility
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateOrganizationConstantDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateOrganizationConstantDto
- UpdateOrganizationConstantDto
```

--------------------------------------------------------------------------------

---[FILE: valid-app.guard.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/guards/valid-app.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class ValidAppGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidAppGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IOrganizationConstantController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationConstantController
```

--------------------------------------------------------------------------------

---[FILE: IEnvironmentConstantsService.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/interfaces/IEnvironmentConstantsService.ts
Signals: N/A
Excerpt (<=80 chars): export interface EnvironmentConstant {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnvironmentConstant
- EnvironmentConstantValue
- EnvironmentConstantWithValue
- IEnvironmentConstantsService
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/interfaces/IService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IOrganizationConstantsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationConstantsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IOrganizationConstantsUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationConstantsUtilService
```

--------------------------------------------------------------------------------

---[FILE: environment-constants.service.ts]---
Location: ToolJet-develop/server/src/modules/organization-constants/services/environment-constants.service.ts
Signals: NestJS
Excerpt (<=80 chars): export class EnvironmentConstantsService implements IEnvironmentConstantsServ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnvironmentConstantsService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationPaymentController implements IOrganizationPaymentCon...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationPaymentController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationPaymentModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationPaymentModule
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationPaymentService implements IOrganizationPaymentService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationPaymentService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type OrganizationPaymentsAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationPaymentsAbility
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/dto/index.ts
Signals: NestJS
Excerpt (<=80 chars):  export class PortalDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PortalDto
- ProrationDto
- PaymentRedirectDto
- PaymentRedirectDtoObject
- UpdateSubscriptionDto
```

--------------------------------------------------------------------------------

---[FILE: organizationLicenseAccess.guard.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/guards/organizationLicenseAccess.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationLicenseAccessGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationLicenseAccessGuard
```

--------------------------------------------------------------------------------

---[FILE: stripe-webhook.guard.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/guards/stripe-webhook.guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class StripeWebhookGuard implements CanActivate {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StripeWebhookGuard
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IOrganizationPaymentController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationPaymentController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/organization-payments/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IOrganizationPaymentService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationPaymentService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/controller.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationThemesController implements IOrganizationThemesContr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationThemesController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/module.ts
Signals: NestJS
Excerpt (<=80 chars): export class ThemesModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ThemesModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationThemesRepository extends Repository<OrganizationThem...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationThemesRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/service.ts
Signals: NestJS
Excerpt (<=80 chars): export class OrganizationThemesService implements IOrganizationThemesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationThemesService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationThemesUtilService implements IOrganizationThemesUtil...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationThemesUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultThemeName = 'ToolJet';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultThemeName
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class Definition {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Definition
- CreateThemeDto
- UpdateThemeDefinitionDto
- UpdateThemeNameDto
- UpdateThemeDefaultDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/interfaces/IController.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IOrganizationThemesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationThemesController
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/interfaces/IService.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IOrganizationThemesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationThemesService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/organization-themes/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars): export interface IOrganizationThemesUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationThemesUtilService
```

--------------------------------------------------------------------------------

---[FILE: controller.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/controller.ts
Signals: NestJS, Express
Excerpt (<=80 chars): export class OrganizationUsersController implements IOrganizationUsersControl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationUsersController
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/module.ts
Signals: NestJS
Excerpt (<=80 chars):  export class OrganizationUsersModule extends SubModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationUsersModule
```

--------------------------------------------------------------------------------

---[FILE: repository.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/repository.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationUsersRepository extends Repository<OrganizationUser> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationUsersRepository
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/service.ts
Signals: NestJS, Express, TypeORM
Excerpt (<=80 chars): export class OrganizationUsersService implements IOrganizationUsersService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationUsersService
```

--------------------------------------------------------------------------------

---[FILE: util.service.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/util.service.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars): export class OrganizationUsersUtilService implements IOrganizationUsersUtilSe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationUsersUtilService
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/ability/guard.ts
Signals: NestJS
Excerpt (<=80 chars): export class FeatureAbilityGuard extends AbilityGuard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/ability/index.ts
Signals: NestJS
Excerpt (<=80 chars): export type FeatureAbility = Ability<[FEATURE_KEY, Subjects]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/constants/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const MAX_ROW_COUNT = 500;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_ROW_COUNT
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/dto/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateOrgUserDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateOrgUserDto
```

--------------------------------------------------------------------------------

---[FILE: invite-new-user.dto.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/dto/invite-new-user.dto.ts
Signals: N/A
Excerpt (<=80 chars): export class InviteNewUserDto {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InviteNewUserDto
```

--------------------------------------------------------------------------------

---[FILE: IController.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/interfaces/IController.ts
Signals: Express
Excerpt (<=80 chars):  export interface IOrganizationUsersController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationUsersController
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/interfaces/index.ts
Signals: N/A
Excerpt (<=80 chars): export interface UserCsvRow {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserCsvRow
```

--------------------------------------------------------------------------------

---[FILE: IService.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/interfaces/IService.ts
Signals: Express
Excerpt (<=80 chars):  export interface IOrganizationUsersService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationUsersService
```

--------------------------------------------------------------------------------

---[FILE: IUserDetailsService.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/interfaces/IUserDetailsService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IUserDetailsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUserDetailsService
```

--------------------------------------------------------------------------------

---[FILE: IUtilService.ts]---
Location: ToolJet-develop/server/src/modules/organization-users/interfaces/IUtilService.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IOrganizationUsersUtilService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IOrganizationUsersUtilService
```

--------------------------------------------------------------------------------

````
