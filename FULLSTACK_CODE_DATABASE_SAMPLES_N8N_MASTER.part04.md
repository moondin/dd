---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 4
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 4 of 51)

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

---[FILE: worker.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/worker.ts
Signals: N/A
Excerpt (<=80 chars):  export type SendWorkerStatusMessage = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SendWorkerStatusMessage
- WorkerPushMessage
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/workflow.ts
Signals: N/A
Excerpt (<=80 chars): export type WorkflowActivated = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowActivated
- WorkflowFailedToActivate
- WorkflowDeactivated
- WorkflowAutoDeactivated
- WorkflowPushMessage
```

--------------------------------------------------------------------------------

---[FILE: banner-name.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/banner-name.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const staticBannerNameSchema = z.enum([

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- staticBannerNameSchema
- dynamicBannerNameSchema
- bannerNameSchema
- BannerName
```

--------------------------------------------------------------------------------

---[FILE: binary-data.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/binary-data.schema.ts
Signals: N/A
Excerpt (<=80 chars): export const ViewableMimeTypes = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ViewableMimeTypes
```

--------------------------------------------------------------------------------

---[FILE: boolean-from-string.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/boolean-from-string.ts
Signals: Zod
Excerpt (<=80 chars):  export const booleanFromString = z.enum(['true', 'false']).transform((value)...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- booleanFromString
```

--------------------------------------------------------------------------------

---[FILE: breaking-changes.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/breaking-changes.schema.ts
Signals: Zod
Excerpt (<=80 chars): export const breakingChangeRuleSeveritySchema = z.enum(['low', 'medium', 'cri...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- breakingChangeRuleSeveritySchema
- breakingChangeIssueLevelSchema
- BreakingChangeRuleSeverity
- BreakingChangeVersion
- BreakingChangeRecommendation
- BreakingChangeInstanceIssue
- BreakingChangeWorkflowIssue
- BreakingChangeAffectedWorkflow
- BreakingChangeInstanceRuleResult
- BreakingChangeWorkflowRuleResult
- BreakingChangeReportResult
- BreakingChangeLightReportResult
```

--------------------------------------------------------------------------------

---[FILE: credential-resolver.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/credential-resolver.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const credentialResolverIdSchema = z.string().max(36);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentialResolverIdSchema
- credentialResolverNameSchema
- credentialResolverTypeNameSchema
- credentialResolverConfigSchema
- credentialResolverSchema
- credentialResolverTypeSchema
- credentialResolverTypesSchema
- credentialResolversSchema
- CredentialResolverType
- CredentialResolver
```

--------------------------------------------------------------------------------

---[FILE: data-table-filter.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/data-table-filter.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const FilterConditionSchema = z.union([

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterConditionSchema
- dataTableFilterRecordSchema
- dataTableFilterTypeSchema
- dataTableFilterSchema
- DataTableFilterConditionType
- DataTableFilter
```

--------------------------------------------------------------------------------

---[FILE: data-table.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/data-table.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const insertRowReturnType = z.union([z.literal('all'), z.literal('cou...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- insertRowReturnType
- dataTableNameSchema
- dataTableIdSchema
- DATA_TABLE_COLUMN_REGEX
- DATA_TABLE_COLUMN_MAX_LENGTH
- DATA_TABLE_COLUMN_ERROR_MESSAGE
- dataTableColumnNameSchema
- dataTableColumnTypeSchema
- dataTableCreateColumnSchema
- dataTableColumnSchema
- dataTableSchema
- dateTimeSchema
- dataTableColumnValueSchema
- DataTable
- DataTableColumn
- DataTableListFilter
- DataTableListOptions
```

--------------------------------------------------------------------------------

---[FILE: external-secrets.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/external-secrets.schema.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExternalSecretsProviderSecret {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsProviderData
- ExternalSecretsProviderProperty
- ExternalSecretsProviderState
- ExternalSecretsProviderSecret
- ExternalSecretsProvider
```

--------------------------------------------------------------------------------

---[FILE: folder.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/folder.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const folderNameSchema = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- folderNameSchema
- folderIdSchema
```

--------------------------------------------------------------------------------

---[FILE: insights.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/insights.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const insightsSummaryTypeSchema = z.enum([

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- insightsSummaryTypeSchema
- insightsSummaryUnitSchema
- insightsSummaryDataSchemas
- insightsSummarySchema
- insightsByWorkflowDataSchemas
- insightsByWorkflowSchema
- insightsByTimeDataSchemas
- insightsByTimeSchema
- restrictedInsightsByTimeDataSchema
- restrictedInsightsByTimeSchema
- insightsDateRangeSchema
- InsightsSummaryType
- InsightsSummaryUnit
- InsightsSummary
- InsightsByWorkflow
- InsightsByTime
- RestrictedInsightsByTime
- InsightsDateRange
```

--------------------------------------------------------------------------------

---[FILE: node-version.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/node-version.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const nodeVersionSchema = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodeVersionSchema
```

--------------------------------------------------------------------------------

---[FILE: password-reset-token.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/password-reset-token.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const passwordResetTokenSchema = z.string().min(10, 'Token too short');

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- passwordResetTokenSchema
```

--------------------------------------------------------------------------------

---[FILE: password.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/password.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const passwordSchema = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- passwordSchema
```

--------------------------------------------------------------------------------

---[FILE: project.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/project.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const projectNameSchema = z.string().min(1).max(255);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- projectNameSchema
- projectTypeSchema
- projectIconSchema
- projectDescriptionSchema
- projectRelationSchema
- ProjectType
- ProjectIcon
- ProjectRelation
```

--------------------------------------------------------------------------------

---[FILE: scopes.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/scopes.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const scopesSchema = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- scopesSchema
```

--------------------------------------------------------------------------------

---[FILE: source-controlled-file.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/source-controlled-file.schema.ts
Signals: Zod
Excerpt (<=80 chars): export const SOURCE_CONTROL_FILE_TYPE = FileTypeSchema.Values;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isSourceControlledFileStatus
- SOURCE_CONTROL_FILE_TYPE
- SOURCE_CONTROL_FILE_STATUS
- SOURCE_CONTROL_FILE_LOCATION
- SourceControlledFileSchema
- SourceControlledFileStatus
- SourceControlledFile
```

--------------------------------------------------------------------------------

---[FILE: usage.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/usage.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const usageStateSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usageStateSchema
- UsageState
```

--------------------------------------------------------------------------------

---[FILE: user-settings.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/user-settings.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const npsSurveyRespondedSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- npsSurveyRespondedSchema
- npsSurveyWaitingSchema
- npsSurveySchema
- userSettingsSchema
- UserSettings
```

--------------------------------------------------------------------------------

---[FILE: user.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/user.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const ROLE = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ROLE
- roleSchema
- userProjectSchema
- userBaseSchema
- userDetailSchema
- usersListSchema
- User
- UsersList
```

--------------------------------------------------------------------------------

---[FILE: workflow-execution-status.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/workflow-execution-status.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const WorkflowExecutionStatusSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecutionStatusSchema
- WorkflowExecutionStatus
```

--------------------------------------------------------------------------------

---[FILE: workflow-version.schema.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/workflow-version.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const WORKFLOW_VERSION_NAME_MAX_LENGTH = 128;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WORKFLOW_VERSION_NAME_MAX_LENGTH
- WORKFLOW_VERSION_DESCRIPTION_MAX_LENGTH
- workflowVersionNameSchema
- workflowVersionDescriptionSchema
```

--------------------------------------------------------------------------------

---[FILE: credential-resolver.schema.test.ts]---
Location: n8n-master/packages/@n8n/api-types/src/schemas/__tests__/credential-resolver.schema.test.ts
Signals: Zod
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: cli-parser.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/cli-parser.ts
Signals: Zod
Excerpt (<=80 chars): export class CliParser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CliParser
```

--------------------------------------------------------------------------------

---[FILE: environment.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/environment.ts
Signals: N/A
Excerpt (<=80 chars):  export const inTest = NODE_ENV === 'test';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inTest
- inProduction
- inDevelopment
```

--------------------------------------------------------------------------------

---[FILE: license-state.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/license-state.ts
Signals: N/A
Excerpt (<=80 chars): export class LicenseState {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseState
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type FeatureReturnType = Partial<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FeatureReturnType
- LicenseProvider
```

--------------------------------------------------------------------------------

---[FILE: logger.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/logging/logger.ts
Signals: N/A
Excerpt (<=80 chars): export class Logger implements LoggerType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Logger
```

--------------------------------------------------------------------------------

---[FILE: module-registry.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/modules/module-registry.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ModuleRegistry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModuleRegistry
```

--------------------------------------------------------------------------------

---[FILE: modules.config.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/modules/modules.config.ts
Signals: N/A
Excerpt (<=80 chars):  export const MODULE_NAMES = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MODULE_NAMES
- ModulesConfig
- ModuleName
```

--------------------------------------------------------------------------------

---[FILE: missing-module.error.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/modules/errors/missing-module.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class MissingModuleError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingModuleError
```

--------------------------------------------------------------------------------

---[FILE: module-confusion.error.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/modules/errors/module-confusion.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ModuleConfusionError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModuleConfusionError
```

--------------------------------------------------------------------------------

---[FILE: unknown-module.error.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/modules/errors/unknown-module.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UnknownModuleError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnknownModuleError
```

--------------------------------------------------------------------------------

---[FILE: is-object-literal.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/utils/is-object-literal.ts
Signals: N/A
Excerpt (<=80 chars): export function isObjectLiteral(candidate: unknown): candidate is ObjectLiter...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isObjectLiteral
```

--------------------------------------------------------------------------------

---[FILE: path-util.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/utils/path-util.ts
Signals: N/A
Excerpt (<=80 chars): export function isContainedWithin(parentPath: string, childPath: string): boo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isContainedWithin
- safeJoinPath
```

--------------------------------------------------------------------------------

---[FILE: cli-parser.test.ts]---
Location: n8n-master/packages/@n8n/backend-common/src/__tests__/cli-parser.test.ts
Signals: Zod
Excerpt (<=80 chars): import { mock } from 'jest-mock-extended';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/backend-test-utils/src/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockLogger = (): Logger =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockLogger
```

--------------------------------------------------------------------------------

---[FILE: migration-test-helpers.ts]---
Location: n8n-master/packages/@n8n/backend-test-utils/src/migration-test-helpers.ts
Signals: TypeORM
Excerpt (<=80 chars): export interface TestMigrationContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestMigrationContext
- TestMigrationContext
```

--------------------------------------------------------------------------------

---[FILE: mocking.ts]---
Location: n8n-master/packages/@n8n/backend-test-utils/src/mocking.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockInstance = <T>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockInstance
```

--------------------------------------------------------------------------------

---[FILE: random.ts]---
Location: n8n-master/packages/@n8n/backend-test-utils/src/random.ts
Signals: N/A
Excerpt (<=80 chars):  export type CredentialPayload = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- randomApiKey
- chooseRandomly
- randomValidPassword
- randomInvalidPassword
- randomName
- randomEmail
- randomCredentialPayload
- randomCredentialPayloadWithOauthTokenData
- uniqueId
- CredentialPayload
```

--------------------------------------------------------------------------------

---[FILE: test-db.ts]---
Location: n8n-master/packages/@n8n/backend-test-utils/src/test-db.ts
Signals: TypeORM
Excerpt (<=80 chars):  export const testDbPrefix = 'n8n_test_';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isReady
- testDbPrefix
- getBootstrapDBOptions
```

--------------------------------------------------------------------------------

---[FILE: projects.ts]---
Location: n8n-master/packages/@n8n/backend-test-utils/src/db/projects.ts
Signals: N/A
Excerpt (<=80 chars):  export const linkUserToProject = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- linkUserToProject
- createTeamProject
- getPersonalProject
- findProject
- getProjectRelations
- getProjectRoleForUser
- getAllProjectRelations
```

--------------------------------------------------------------------------------

---[FILE: workflows.ts]---
Location: n8n-master/packages/@n8n/backend-test-utils/src/db/workflows.ts
Signals: N/A
Excerpt (<=80 chars):  export function newWorkflow(attributes: Partial<IWorkflowDb> = {}): IWorkflo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newWorkflow
- getWorkflowById
```

--------------------------------------------------------------------------------

---[FILE: common-flags.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/config/common-flags.ts
Signals: N/A
Excerpt (<=80 chars):  export const testScenariosPath = Flags.string({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- testScenariosPath
```

--------------------------------------------------------------------------------

---[FILE: authenticated-n8n-api-client.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/n8n-api-client/authenticated-n8n-api-client.ts
Signals: N/A
Excerpt (<=80 chars):  export class AuthenticatedN8nApiClient extends N8nApiClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthenticatedN8nApiClient
```

--------------------------------------------------------------------------------

---[FILE: credentials-api-client.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/n8n-api-client/credentials-api-client.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialApiClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialApiClient
```

--------------------------------------------------------------------------------

---[FILE: data-table-api-client.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/n8n-api-client/data-table-api-client.ts
Signals: N/A
Excerpt (<=80 chars):  export class DataTableApiClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataTableApiClient
```

--------------------------------------------------------------------------------

---[FILE: n8n-api-client.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/n8n-api-client/n8n-api-client.ts
Signals: N/A
Excerpt (<=80 chars):  export class N8nApiClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nApiClient
```

--------------------------------------------------------------------------------

---[FILE: n8n-api-client.types.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/n8n-api-client/n8n-api-client.types.ts
Signals: N/A
Excerpt (<=80 chars): export type Workflow = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Workflow
- Credential
- DataTableColumn
- DataTable
```

--------------------------------------------------------------------------------

---[FILE: project-api-client.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/n8n-api-client/project-api-client.ts
Signals: N/A
Excerpt (<=80 chars):  export class ProjectApiClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectApiClient
```

--------------------------------------------------------------------------------

---[FILE: workflows-api-client.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/n8n-api-client/workflows-api-client.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowApiClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowApiClient
```

--------------------------------------------------------------------------------

---[FILE: scenario-data-loader.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/scenario/scenario-data-loader.ts
Signals: N/A
Excerpt (<=80 chars):  export type LoadableScenarioData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScenarioDataFileLoader
- LoadableScenarioData
```

--------------------------------------------------------------------------------

---[FILE: scenario-loader.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/scenario/scenario-loader.ts
Signals: N/A
Excerpt (<=80 chars):  export class ScenarioLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScenarioLoader
```

--------------------------------------------------------------------------------

---[FILE: app-metrics-poller.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/test-execution/app-metrics-poller.ts
Signals: N/A
Excerpt (<=80 chars): export class AppMetricsPoller {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppMetricsPoller
```

--------------------------------------------------------------------------------

---[FILE: k6-executor.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/test-execution/k6-executor.ts
Signals: N/A
Excerpt (<=80 chars): export type { K6Tag };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleSummary
- K6Executor
- K6ExecutorOpts
- K6RunOpts
```

--------------------------------------------------------------------------------

---[FILE: prometheus-metrics-parser.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/test-execution/prometheus-metrics-parser.ts
Signals: N/A
Excerpt (<=80 chars): export class PrometheusMetricsParser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrometheusMetricsParser
```

--------------------------------------------------------------------------------

---[FILE: scenario-data-importer.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/test-execution/scenario-data-importer.ts
Signals: N/A
Excerpt (<=80 chars): export class ScenarioDataImporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScenarioDataImporter
```

--------------------------------------------------------------------------------

---[FILE: scenario-runner.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/test-execution/scenario-runner.ts
Signals: N/A
Excerpt (<=80 chars): export class ScenarioRunner {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScenarioRunner
```

--------------------------------------------------------------------------------

---[FILE: test-report.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/test-execution/test-report.ts
Signals: N/A
Excerpt (<=80 chars):  export type K6Tag = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildAppMetricsReport
- buildTestReport
- K6Tag
- Check
- CounterMetric
- TrendMetric
- AppMetricStats
- AppMetricsReport
- TestReport
```

--------------------------------------------------------------------------------

---[FILE: scenario.ts]---
Location: n8n-master/packages/@n8n/benchmark/src/types/scenario.ts
Signals: N/A
Excerpt (<=80 chars): export type ScenarioData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScenarioData
- ScenarioManifest
- Scenario
```

--------------------------------------------------------------------------------

---[FILE: client-oauth2-token.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/src/client-oauth2-token.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ClientOAuth2TokenData extends Record<string, string | undef...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClientOAuth2Token
- ClientOAuth2TokenData
```

--------------------------------------------------------------------------------

---[FILE: client-oauth2.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/src/client-oauth2.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ClientOAuth2RequestObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResponseError
- ClientOAuth2
- ClientOAuth2RequestObject
- ClientOAuth2Options
```

--------------------------------------------------------------------------------

---[FILE: code-flow.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/src/code-flow.ts
Signals: N/A
Excerpt (<=80 chars): export class CodeFlow {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeFlow
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/src/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_URL_BASE = 'https://example.org/';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_URL_BASE
```

--------------------------------------------------------------------------------

---[FILE: credentials-flow.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/src/credentials-flow.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsFlow {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsFlow
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/src/types.ts
Signals: N/A
Excerpt (<=80 chars): export type Headers = Record<string, string | string[]>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Headers
- OAuth2GrantType
- OAuth2AuthenticationMethod
- OAuth2CredentialData
- OAuth2AccessTokenErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/src/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function expects<Keys extends keyof ClientOAuth2Options>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAuthError
- auth
- getRequestOptions
- AuthError
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: n8n-master/packages/@n8n/client-oauth2/test/config.ts
Signals: N/A
Excerpt (<=80 chars): export const baseUrl = 'https://mock.auth.service';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- baseUrl
- accessTokenUri
- authorizationUri
- redirectUri
- accessToken
- refreshToken
- refreshedAccessToken
- refreshedRefreshToken
- clientId
- clientSecret
- code
- state
```

--------------------------------------------------------------------------------

---[FILE: grammar.terms.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang/src/expressions/grammar.terms.ts
Signals: N/A
Excerpt (<=80 chars): export const Program = 1,

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Program
```

--------------------------------------------------------------------------------

---[FILE: grammar.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang/src/expressions/grammar.ts
Signals: N/A
Excerpt (<=80 chars): export const parser = LRParser.deserialize({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parser
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang/src/expressions/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const expressionParser = parser;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- n8nExpression
- expressionParser
- parserWithMetaData
- n8nLanguage
```

--------------------------------------------------------------------------------

---[FILE: complete.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang-sql/src/complete.ts
Signals: N/A
Excerpt (<=80 chars):  export function completeFromSchema(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- completeFromSchema
- completeKeywords
```

--------------------------------------------------------------------------------

---[FILE: grammar.sql.terms.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang-sql/src/grammar.sql.terms.ts
Signals: N/A
Excerpt (<=80 chars): export const Whitespace = 1,

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Whitespace
```

--------------------------------------------------------------------------------

---[FILE: grammar.sql.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang-sql/src/grammar.sql.ts
Signals: N/A
Excerpt (<=80 chars): export const parser = LRParser.deserialize({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parser
```

--------------------------------------------------------------------------------

---[FILE: sql.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang-sql/src/sql.ts
Signals: N/A
Excerpt (<=80 chars):  export const getParser = (dialect: Dialect) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- keywordCompletionSource
- keywordCompletion
- schemaCompletionSource
- schemaCompletion
- sql
- getParser
- StandardSQL
- PostgreSQL
- MySQL
- MariaSQL
- MSSQL
- SQLite
- Cassandra
- PLSQL
- OracleDB
- SQLDialect
- SQLDialectSpec
- SQLConfig
```

--------------------------------------------------------------------------------

---[FILE: tokens.ts]---
Location: n8n-master/packages/@n8n/codemirror-lang-sql/src/tokens.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Dialect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dialect
- tokensFor
- SQLTypes
- SQLFunctions
- SQLKeywords
- tokens
```

--------------------------------------------------------------------------------

---[FILE: custom-types.ts]---
Location: n8n-master/packages/@n8n/config/src/custom-types.ts
Signals: N/A
Excerpt (<=80 chars):  export class CommaSeparatedStringArray<T extends string> extends StringArray...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommaSeparatedStringArray
- ColonSeparatedStringArray
```

--------------------------------------------------------------------------------

---[FILE: decorators.ts]---
Location: n8n-master/packages/@n8n/config/src/decorators.ts
Signals: Zod
Excerpt (<=80 chars):  export const Config: ClassDecorator = (ConfigClass: Class) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Env
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/config/src/index.ts
Signals: Zod
Excerpt (<=80 chars): export type { TaskRunnerMode } from './configs/runners.config';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GlobalConfig
- Protocol
```

--------------------------------------------------------------------------------

---[FILE: ai-assistant.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/ai-assistant.config.ts
Signals: N/A
Excerpt (<=80 chars): export class AiAssistantConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiAssistantConfig
```

--------------------------------------------------------------------------------

---[FILE: ai-builder.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/ai-builder.config.ts
Signals: N/A
Excerpt (<=80 chars): export class AiBuilderConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiBuilderConfig
```

--------------------------------------------------------------------------------

---[FILE: ai.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/ai.config.ts
Signals: N/A
Excerpt (<=80 chars): export class AiConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiConfig
```

--------------------------------------------------------------------------------

---[FILE: auth.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/auth.config.ts
Signals: Zod
Excerpt (<=80 chars): export class AuthConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthConfig
```

--------------------------------------------------------------------------------

---[FILE: cache.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/cache.config.ts
Signals: Zod
Excerpt (<=80 chars): export class CacheConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CacheConfig
```

--------------------------------------------------------------------------------

---[FILE: credentials.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/credentials.config.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsConfig
```

--------------------------------------------------------------------------------

---[FILE: data-table.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/data-table.config.ts
Signals: N/A
Excerpt (<=80 chars): export class DataTableConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataTableConfig
```

--------------------------------------------------------------------------------

---[FILE: database.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/database.config.ts
Signals: Zod
Excerpt (<=80 chars): export class SqliteConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SqliteConfig
- DatabaseConfig
```

--------------------------------------------------------------------------------

---[FILE: deployment.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/deployment.config.ts
Signals: N/A
Excerpt (<=80 chars): export class DeploymentConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeploymentConfig
```

--------------------------------------------------------------------------------

---[FILE: diagnostics.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/diagnostics.config.ts
Signals: N/A
Excerpt (<=80 chars): export class DiagnosticsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiagnosticsConfig
```

--------------------------------------------------------------------------------

---[FILE: dynamic-banners.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/dynamic-banners.config.ts
Signals: N/A
Excerpt (<=80 chars): export class DynamicBannersConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicBannersConfig
```

--------------------------------------------------------------------------------

---[FILE: endpoints.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/endpoints.config.ts
Signals: N/A
Excerpt (<=80 chars): export class EndpointsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EndpointsConfig
```

--------------------------------------------------------------------------------

---[FILE: event-bus.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/event-bus.config.ts
Signals: Zod
Excerpt (<=80 chars): export class EventBusConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventBusConfig
```

--------------------------------------------------------------------------------

---[FILE: executions.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/executions.config.ts
Signals: Zod
Excerpt (<=80 chars):  export type ExecutionMode = z.infer<typeof executionModeSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionsConfig
- ExecutionMode
```

--------------------------------------------------------------------------------

---[FILE: external-hooks.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/external-hooks.config.ts
Signals: N/A
Excerpt (<=80 chars): export class ExternalHooksConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalHooksConfig
```

--------------------------------------------------------------------------------

---[FILE: generic.config.ts]---
Location: n8n-master/packages/@n8n/config/src/configs/generic.config.ts
Signals: Zod
Excerpt (<=80 chars): export class GenericConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericConfig
```

--------------------------------------------------------------------------------

````
