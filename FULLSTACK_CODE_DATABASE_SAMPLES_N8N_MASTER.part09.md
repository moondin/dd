---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 9
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 9 of 51)

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

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/db/src/subscribers/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const subscribers = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- subscribers
```

--------------------------------------------------------------------------------

---[FILE: user-subscriber.ts]---
Location: n8n-master/packages/@n8n/db/src/subscribers/user-subscriber.ts
Signals: N/A
Excerpt (<=80 chars): export class UserSubscriber implements EntitySubscriberInterface<User> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserSubscriber
```

--------------------------------------------------------------------------------

---[FILE: build-workflows-by-nodes-query.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/build-workflows-by-nodes-query.ts
Signals: N/A
Excerpt (<=80 chars): export function buildWorkflowsByNodesQuery(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildWorkflowsByNodesQuery
```

--------------------------------------------------------------------------------

---[FILE: generators.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/generators.ts
Signals: N/A
Excerpt (<=80 chars):  export function generateNanoId() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateNanoId
- generateHostInstanceId
```

--------------------------------------------------------------------------------

---[FILE: get-final-test-result.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/get-final-test-result.ts
Signals: N/A
Excerpt (<=80 chars): export function getTestRunFinalResult(testCaseExecutions: TestCaseExecution[]...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTestRunFinalResult
```

--------------------------------------------------------------------------------

---[FILE: is-string-array.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/is-string-array.ts
Signals: N/A
Excerpt (<=80 chars): export function isStringArray(value: unknown): value is string[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isStringArray
```

--------------------------------------------------------------------------------

---[FILE: is-valid-email.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/is-valid-email.ts
Signals: Zod
Excerpt (<=80 chars):  export function isValidEmail(email: string): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isValidEmail
```

--------------------------------------------------------------------------------

---[FILE: separate.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/separate.ts
Signals: N/A
Excerpt (<=80 chars): export const separate = <T>(array: T[], test: (element: T) => boolean) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- separate
```

--------------------------------------------------------------------------------

---[FILE: sql.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/sql.ts
Signals: N/A
Excerpt (<=80 chars): export function sql(strings: TemplateStringsArray, ...values: string[]): stri...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sql
```

--------------------------------------------------------------------------------

---[FILE: timed-query.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/timed-query.ts
Signals: N/A
Excerpt (<=80 chars): export const TimedQuery = Timed(Container.get(Logger), 'Slow database query');

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TimedQuery
```

--------------------------------------------------------------------------------

---[FILE: transformers.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/transformers.ts
Signals: N/A
Excerpt (<=80 chars):  export const idStringifier = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- idStringifier
- lowerCaser
- sqlite
```

--------------------------------------------------------------------------------

---[FILE: mock-entity-manager.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/test-utils/mock-entity-manager.ts
Signals: TypeORM
Excerpt (<=80 chars):  export const mockEntityManager = (entityClass: Class) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockEntityManager
```

--------------------------------------------------------------------------------

---[FILE: mock-instance.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/test-utils/mock-instance.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockInstance = <T>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockInstance
```

--------------------------------------------------------------------------------

---[FILE: no-url.validator.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/validators/no-url.validator.ts
Signals: N/A
Excerpt (<=80 chars):  export function NoUrl(options?: ValidationOptions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoUrl
```

--------------------------------------------------------------------------------

---[FILE: no-xss.validator.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/validators/no-xss.validator.ts
Signals: N/A
Excerpt (<=80 chars):  export function NoXss(options?: ValidationOptions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoXss
```

--------------------------------------------------------------------------------

---[FILE: no-url.validator.test.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/validators/__tests__/no-url.validator.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import { validate } from 'class-validator';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: no-xss.validator.test.ts]---
Location: n8n-master/packages/@n8n/db/src/utils/validators/__tests__/no-xss.validator.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import { validate } from 'class-validator';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: debounce.ts]---
Location: n8n-master/packages/@n8n/decorators/src/debounce.ts
Signals: N/A
Excerpt (<=80 chars): export const Debounce =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Debounce
```

--------------------------------------------------------------------------------

---[FILE: errors.ts]---
Location: n8n-master/packages/@n8n/decorators/src/errors.ts
Signals: N/A
Excerpt (<=80 chars):  export class NonMethodError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NonMethodError
```

--------------------------------------------------------------------------------

---[FILE: redactable.ts]---
Location: n8n-master/packages/@n8n/decorators/src/redactable.ts
Signals: N/A
Excerpt (<=80 chars):  export class RedactableError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Redactable
- RedactableError
```

--------------------------------------------------------------------------------

---[FILE: timed.ts]---
Location: n8n-master/packages/@n8n/decorators/src/timed.ts
Signals: N/A
Excerpt (<=80 chars): export interface TimedOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Timed
- TimedOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/decorators/src/types.ts
Signals: N/A
Excerpt (<=80 chars): export type Class<T = object, A extends unknown[] = unknown[]> = new (...args...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Class
- EventHandlerClass
- EventHandler
```

--------------------------------------------------------------------------------

---[FILE: command-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/command/command-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export class CommandMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommandMetadata
```

--------------------------------------------------------------------------------

---[FILE: command.ts]---
Location: n8n-master/packages/@n8n/decorators/src/command/command.ts
Signals: N/A
Excerpt (<=80 chars):  export const Command =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Command
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/decorators/src/command/types.ts
Signals: Zod
Excerpt (<=80 chars):  export type CommandOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommandOptions
- ICommand
- CommandClass
- CommandEntry
```

--------------------------------------------------------------------------------

---[FILE: command.test.ts]---
Location: n8n-master/packages/@n8n/decorators/src/command/__tests__/command.test.ts
Signals: Zod
Excerpt (<=80 chars): import { Container } from '@n8n/di';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: context-establishment-hook-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/context-establishment/context-establishment-hook-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export class ContextEstablishmentHookMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContextEstablishmentHook
- ContextEstablishmentHookMetadata
```

--------------------------------------------------------------------------------

---[FILE: context-establishment-hook.ts]---
Location: n8n-master/packages/@n8n/decorators/src/context-establishment/context-establishment-hook.ts
Signals: N/A
Excerpt (<=80 chars): export type ContextEstablishmentOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContextEstablishmentOptions
- ContextEstablishmentResult
- HookDescription
- ContextEstablishmentHookClass
- IContextEstablishmentHook
```

--------------------------------------------------------------------------------

---[FILE: args.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/args.ts
Signals: N/A
Excerpt (<=80 chars): export const Body = ArgDecorator({ type: 'body' });

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Body
- Query
- Param
```

--------------------------------------------------------------------------------

---[FILE: controller-registry-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/controller-registry-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export class ControllerRegistryMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerRegistryMetadata
```

--------------------------------------------------------------------------------

---[FILE: licensed.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/licensed.ts
Signals: N/A
Excerpt (<=80 chars):  export const Licensed =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Licensed
```

--------------------------------------------------------------------------------

---[FILE: middleware.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/middleware.ts
Signals: N/A
Excerpt (<=80 chars):  export const Middleware = (): MethodDecorator => (target, handlerName) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Middleware
```

--------------------------------------------------------------------------------

---[FILE: rest-controller.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/rest-controller.ts
Signals: N/A
Excerpt (<=80 chars):  export const RestController =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestController
```

--------------------------------------------------------------------------------

---[FILE: root-level-controller.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/root-level-controller.ts
Signals: N/A
Excerpt (<=80 chars): export const RootLevelController =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RootLevelController
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/route.ts
Signals: Express
Excerpt (<=80 chars):  export const Get = RouteFactory('get');

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Get
- Post
- Put
- Patch
- Delete
- Head
- Options
```

--------------------------------------------------------------------------------

---[FILE: scoped.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/scoped.ts
Signals: N/A
Excerpt (<=80 chars): export const GlobalScope = (scope: Scope) => Scoped(scope, { globalOnly: true...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GlobalScope
- ProjectScope
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/decorators/src/controller/types.ts
Signals: Express
Excerpt (<=80 chars):  export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Method
- Arg
- HandlerName
- StaticRouterMetadata
- RateLimit
- AccessScope
- RouteMetadata
- ControllerMetadata
```

--------------------------------------------------------------------------------

---[FILE: credential-resolver-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/credential-resolver/credential-resolver-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialResolverEntryMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialResolver
- CredentialResolverEntryMetadata
```

--------------------------------------------------------------------------------

---[FILE: credential-resolver.ts]---
Location: n8n-master/packages/@n8n/decorators/src/credential-resolver/credential-resolver.ts
Signals: N/A
Excerpt (<=80 chars): export type CredentialResolverConfiguration = Record<string, unknown>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialResolverConfiguration
- CredentialResolverHandle
- CredentialResolverClass
- CredentialResolverMetadata
- ICredentialResolver
```

--------------------------------------------------------------------------------

---[FILE: errors.ts]---
Location: n8n-master/packages/@n8n/decorators/src/credential-resolver/errors.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialResolverError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialResolverError
- CredentialResolverDataNotFoundError
- CredentialResolverValidationError
```

--------------------------------------------------------------------------------

---[FILE: lifecycle-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/execution-lifecycle/lifecycle-metadata.ts
Signals: N/A
Excerpt (<=80 chars):  export type LifecycleHandlerClass = Class<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LifecycleMetadata
- LifecycleHandlerClass
- NodeExecuteBeforeContext
- NodeExecuteAfterContext
- WorkflowExecuteBeforeContext
- WorkflowExecuteAfterContext
- LifecycleContext
- LifecycleEvent
```

--------------------------------------------------------------------------------

---[FILE: on-lifecycle-event.ts]---
Location: n8n-master/packages/@n8n/decorators/src/execution-lifecycle/on-lifecycle-event.ts
Signals: N/A
Excerpt (<=80 chars): export const OnLifecycleEvent =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnLifecycleEvent
```

--------------------------------------------------------------------------------

---[FILE: module-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/module/module-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export class ModuleMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModuleMetadata
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: n8n-master/packages/@n8n/decorators/src/module/module.ts
Signals: N/A
Excerpt (<=80 chars): export interface BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackendModule
- EntityClass
- ModuleSettings
- ModuleContext
- ModuleClass
- LicenseFlag
- BackendModuleOptions
- BaseEntity
- TimestampedIdEntity
- TimestampedEntity
- ModuleInterface
```

--------------------------------------------------------------------------------

---[FILE: multi-main-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/multi-main/multi-main-metadata.ts
Signals: N/A
Excerpt (<=80 chars):  export const LEADER_TAKEOVER_EVENT_NAME = 'leader-takeover';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LEADER_TAKEOVER_EVENT_NAME
- LEADER_STEPDOWN_EVENT_NAME
- MultiMainMetadata
- MultiMainEvent
```

--------------------------------------------------------------------------------

---[FILE: on-multi-main-event.ts]---
Location: n8n-master/packages/@n8n/decorators/src/multi-main/on-multi-main-event.ts
Signals: N/A
Excerpt (<=80 chars): export const OnLeaderTakeover = () => OnMultiMainEvent(LEADER_TAKEOVER_EVENT_...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnLeaderTakeover
- OnLeaderStepdown
```

--------------------------------------------------------------------------------

---[FILE: on-pubsub-event.ts]---
Location: n8n-master/packages/@n8n/decorators/src/pubsub/on-pubsub-event.ts
Signals: N/A
Excerpt (<=80 chars): export const OnPubSubEvent =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnPubSubEvent
```

--------------------------------------------------------------------------------

---[FILE: pubsub-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/pubsub/pubsub-metadata.ts
Signals: N/A
Excerpt (<=80 chars):  export type PubSubEventName =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PubSubMetadata
- PubSubEventName
- PubSubEventFilter
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/@n8n/decorators/src/shutdown/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const LOWEST_SHUTDOWN_PRIORITY = 0;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LOWEST_SHUTDOWN_PRIORITY
- DEFAULT_SHUTDOWN_PRIORITY
- HIGHEST_SHUTDOWN_PRIORITY
```

--------------------------------------------------------------------------------

---[FILE: on-shutdown.ts]---
Location: n8n-master/packages/@n8n/decorators/src/shutdown/on-shutdown.ts
Signals: N/A
Excerpt (<=80 chars): export const OnShutdown =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnShutdown
```

--------------------------------------------------------------------------------

---[FILE: shutdown-metadata.ts]---
Location: n8n-master/packages/@n8n/decorators/src/shutdown/shutdown-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export class ShutdownMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShutdownMetadata
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/decorators/src/shutdown/types.ts
Signals: N/A
Excerpt (<=80 chars): export type ShutdownServiceClass = Class<Record<string, ShutdownHandlerFn>>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShutdownServiceClass
- ShutdownHandler
```

--------------------------------------------------------------------------------

---[FILE: di.ts]---
Location: n8n-master/packages/@n8n/di/src/di.ts
Signals: N/A
Excerpt (<=80 chars): export type Constructable<T = unknown> = new (...args: any[]) => T;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Container
- Constructable
```

--------------------------------------------------------------------------------

---[FILE: service-a.ts]---
Location: n8n-master/packages/@n8n/di/src/__tests__/fixtures/service-a.ts
Signals: N/A
Excerpt (<=80 chars): export class ServiceA {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServiceA
```

--------------------------------------------------------------------------------

---[FILE: service-b.ts]---
Location: n8n-master/packages/@n8n/di/src/__tests__/fixtures/service-b.ts
Signals: N/A
Excerpt (<=80 chars): export class ServiceB {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServiceB
```

--------------------------------------------------------------------------------

---[FILE: application.error.ts]---
Location: n8n-master/packages/@n8n/errors/src/application.error.ts
Signals: N/A
Excerpt (<=80 chars): export class ApplicationError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApplicationError
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/errors/src/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type ErrorLevel = 'fatal' | 'error' | 'warning' | 'info';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorLevel
- ErrorTags
- ReportingOptions
```

--------------------------------------------------------------------------------

---[FILE: plugin.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/plugin.ts
Signals: N/A
Excerpt (<=80 chars):  export const localRulesPlugin = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRulesPlugin
```

--------------------------------------------------------------------------------

---[FILE: base.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/configs/base.ts
Signals: N/A
Excerpt (<=80 chars):  export const baseConfig = tseslint.config(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- baseConfig
```

--------------------------------------------------------------------------------

---[FILE: frontend.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/configs/frontend.ts
Signals: N/A
Excerpt (<=80 chars):  export const frontendConfig = tseslint.config(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- frontendConfig
```

--------------------------------------------------------------------------------

---[FILE: node.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/configs/node.ts
Signals: N/A
Excerpt (<=80 chars):  export const nodeConfig = tseslint.config(baseConfig, {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodeConfig
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const rules = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rules
```

--------------------------------------------------------------------------------

---[FILE: misplaced-n8n-typeorm-import.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/misplaced-n8n-typeorm-import.ts
Signals: N/A
Excerpt (<=80 chars):  export const MisplacedN8nTypeormImportRule = ESLintUtils.RuleCreator.without...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MisplacedN8nTypeormImportRule
```

--------------------------------------------------------------------------------

---[FILE: no-argument-spread.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-argument-spread.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoArgumentSpreadRule = ESLintUtils.RuleCreator.withoutDocs({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoArgumentSpreadRule
```

--------------------------------------------------------------------------------

---[FILE: no-constructor-in-backend-module.test.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-constructor-in-backend-module.test.ts
Signals: N/A
Excerpt (<=80 chars): export class TestModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestModule
- RegularClass
- OtherModule
- InsightsModule
```

--------------------------------------------------------------------------------

---[FILE: no-constructor-in-backend-module.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-constructor-in-backend-module.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoConstructorInBackendModuleRule = ESLintUtils.RuleCreator.with...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoConstructorInBackendModuleRule
```

--------------------------------------------------------------------------------

---[FILE: no-dynamic-import-template.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-dynamic-import-template.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoDynamicImportTemplateRule = ESLintUtils.RuleCreator.withoutDo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoDynamicImportTemplateRule
```

--------------------------------------------------------------------------------

---[FILE: no-import-enterprise-edition.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-import-enterprise-edition.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoImportEnterpriseEditionRule = ESLintUtils.RuleCreator.without...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoImportEnterpriseEditionRule
```

--------------------------------------------------------------------------------

---[FILE: no-internal-package-import.test.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-internal-package-import.test.ts
Signals: Express
Excerpt (<=80 chars): import { RuleTester } from '@typescript-eslint/rule-tester';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: no-internal-package-import.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-internal-package-import.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoInternalPackageImportRule = ESLintUtils.RuleCreator.withoutDo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoInternalPackageImportRule
```

--------------------------------------------------------------------------------

---[FILE: no-interpolation-in-regular-string.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-interpolation-in-regular-string.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoInterpolationInRegularStringRule = ESLintUtils.RuleCreator.wi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoInterpolationInRegularStringRule
```

--------------------------------------------------------------------------------

---[FILE: no-json-parse-json-stringify.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-json-parse-json-stringify.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoJsonParseJsonStringifyRule = ESLintUtils.RuleCreator.withoutD...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoJsonParseJsonStringifyRule
```

--------------------------------------------------------------------------------

---[FILE: no-plain-errors.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-plain-errors.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoPlainErrorsRule = ESLintUtils.RuleCreator.withoutDocs({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoPlainErrorsRule
```

--------------------------------------------------------------------------------

---[FILE: no-skipped-tests.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-skipped-tests.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoSkippedTestsRule = ESLintUtils.RuleCreator.withoutDocs({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoSkippedTestsRule
```

--------------------------------------------------------------------------------

---[FILE: no-top-level-relative-imports-in-backend-module.test.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-top-level-relative-imports-in-backend-module.test.ts
Signals: N/A
Excerpt (<=80 chars): export class TestModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestModule
```

--------------------------------------------------------------------------------

---[FILE: no-top-level-relative-imports-in-backend-module.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-top-level-relative-imports-in-backend-module.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoTopLevelRelativeImportsInBackendModuleRule = ESLintUtils.Rule...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoTopLevelRelativeImportsInBackendModuleRule
```

--------------------------------------------------------------------------------

---[FILE: no-type-unsafe-event-emitter.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-type-unsafe-event-emitter.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoTypeUnsafeEventEmitterRule = ESLintUtils.RuleCreator.withoutD...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoTypeUnsafeEventEmitterRule
```

--------------------------------------------------------------------------------

---[FILE: no-uncaught-json-parse.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-uncaught-json-parse.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoUncaughtJsonParseRule = ESLintUtils.RuleCreator.withoutDocs({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoUncaughtJsonParseRule
```

--------------------------------------------------------------------------------

---[FILE: no-unneeded-backticks.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-unneeded-backticks.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoUnneededBackticksRule = ESLintUtils.RuleCreator.withoutDocs({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoUnneededBackticksRule
```

--------------------------------------------------------------------------------

---[FILE: no-untyped-config-class-field.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-untyped-config-class-field.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoUntypedConfigClassFieldRule = ESLintUtils.RuleCreator.without...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoUntypedConfigClassFieldRule
```

--------------------------------------------------------------------------------

---[FILE: no-unused-param-catch-clause.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-unused-param-catch-clause.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoUnusedParamInCatchClauseRule = ESLintUtils.RuleCreator.withou...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoUnusedParamInCatchClauseRule
```

--------------------------------------------------------------------------------

---[FILE: no-useless-catch-throw.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/rules/no-useless-catch-throw.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoUselessCatchThrowRule = ESLintUtils.RuleCreator.withoutDocs({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoUselessCatchThrowRule
```

--------------------------------------------------------------------------------

---[FILE: json.ts]---
Location: n8n-master/packages/@n8n/eslint-config/src/utils/json.ts
Signals: N/A
Excerpt (<=80 chars):  export const isJsonParseCall = (node: TSESTree.CallExpression) =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isJsonParseCall
- isJsonStringifyCall
```

--------------------------------------------------------------------------------

---[FILE: credential-documentation-url.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/credential-documentation-url.test.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestCredential implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCredential
- RegularClass
```

--------------------------------------------------------------------------------

---[FILE: credential-documentation-url.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/credential-documentation-url.ts
Signals: N/A
Excerpt (<=80 chars):  export const CredentialDocumentationUrlRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialDocumentationUrlRule
```

--------------------------------------------------------------------------------

---[FILE: credential-password-field.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/credential-password-field.test.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestCredential implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCredential
- GithubOAuth2Api
- RegularClass
```

--------------------------------------------------------------------------------

---[FILE: credential-password-field.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/credential-password-field.ts
Signals: N/A
Excerpt (<=80 chars):  export const CredentialPasswordFieldRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialPasswordFieldRule
```

--------------------------------------------------------------------------------

---[FILE: credential-test-required.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/credential-test-required.test.ts
Signals: N/A
Excerpt (<=80 chars):  export class ${name.charAt(0).toUpperCase() + name.slice(1)} implements ICre...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MyApi
```

--------------------------------------------------------------------------------

---[FILE: credential-test-required.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/credential-test-required.ts
Signals: N/A
Excerpt (<=80 chars):  export const CredentialTestRequiredRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialTestRequiredRule
```

--------------------------------------------------------------------------------

---[FILE: icon-validation.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/icon-validation.test.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestNode implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNode
- TestCredential
- NotANode
```

--------------------------------------------------------------------------------

---[FILE: icon-validation.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/icon-validation.ts
Signals: N/A
Excerpt (<=80 chars):  export const IconValidationRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IconValidationRule
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const rules = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rules
```

--------------------------------------------------------------------------------

---[FILE: no-credential-reuse.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/no-credential-reuse.test.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestNode implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNode
- RegularClass
- NotANode
```

--------------------------------------------------------------------------------

---[FILE: no-credential-reuse.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/no-credential-reuse.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoCredentialReuseRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoCredentialReuseRule
```

--------------------------------------------------------------------------------

---[FILE: no-deprecated-workflow-functions.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/no-deprecated-workflow-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoDeprecatedWorkflowFunctionsRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoDeprecatedWorkflowFunctionsRule
```

--------------------------------------------------------------------------------

---[FILE: no-restricted-globals.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/no-restricted-globals.ts
Signals: N/A
Excerpt (<=80 chars):  export const NoRestrictedGlobalsRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoRestrictedGlobalsRule
```

--------------------------------------------------------------------------------

---[FILE: no-restricted-imports.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/no-restricted-imports.test.ts
Signals: Express, Zod
Excerpt (<=80 chars): import { RuleTester } from '@typescript-eslint/rule-tester';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: no-restricted-imports.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/no-restricted-imports.ts
Signals: Zod
Excerpt (<=80 chars):  export const NoRestrictedImportsRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoRestrictedImportsRule
```

--------------------------------------------------------------------------------

````
