---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 20
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 20 of 51)

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

---[FILE: credential-resolver-registry.service.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/services/credential-resolver-registry.service.ts
Signals: N/A
Excerpt (<=80 chars): export class DynamicCredentialResolverRegistry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicCredentialResolverRegistry
```

--------------------------------------------------------------------------------

---[FILE: credential-resolver-workflow.service.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/services/credential-resolver-workflow.service.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialResolverWorkflowService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialResolverWorkflowService
```

--------------------------------------------------------------------------------

---[FILE: credential-resolver.service.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/services/credential-resolver.service.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CreateResolverParams {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicCredentialResolverService
- CreateResolverParams
- UpdateResolverParams
```

--------------------------------------------------------------------------------

---[FILE: dynamic-credential-storage.service.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/services/dynamic-credential-storage.service.ts
Signals: N/A
Excerpt (<=80 chars): export class DynamicCredentialStorageService implements IDynamicCredentialSto...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicCredentialStorageService
```

--------------------------------------------------------------------------------

---[FILE: dynamic-credential.service.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/services/dynamic-credential.service.ts
Signals: N/A
Excerpt (<=80 chars): export class DynamicCredentialService implements ICredentialResolutionProvider {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicCredentialService
```

--------------------------------------------------------------------------------

---[FILE: shared-fields.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/services/shared-fields.ts
Signals: N/A
Excerpt (<=80 chars):  export function extractSharedFields(credentialType: ICredentialType): string...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractSharedFields
```

--------------------------------------------------------------------------------

---[FILE: dynamic-credentials.controller.test.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/__tests__/dynamic-credentials.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflow-status.controller.test.ts]---
Location: n8n-master/packages/cli/src/modules/dynamic-credentials.ee/__tests__/workflow-status.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { mock } from 'jest-mock-extended';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const EXTERNAL_SECRETS_DB_KEY = 'feature.externalSecrets';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EXTERNAL_SECRETS_DB_KEY
- EXTERNAL_SECRETS_INITIAL_BACKOFF
- EXTERNAL_SECRETS_MAX_BACKOFF
- EXTERNAL_SECRETS_NAME_REGEX
```

--------------------------------------------------------------------------------

---[FILE: external-secrets-manager.ee.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/external-secrets-manager.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class ExternalSecretsManager implements IExternalSecretsManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsManager
```

--------------------------------------------------------------------------------

---[FILE: external-secrets-providers.ee.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/external-secrets-providers.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class ExternalSecretsProviders {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsProviders
```

--------------------------------------------------------------------------------

---[FILE: external-secrets.config.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/external-secrets.config.ts
Signals: N/A
Excerpt (<=80 chars): export class ExternalSecretsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsConfig
```

--------------------------------------------------------------------------------

---[FILE: external-secrets.controller.ee.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/external-secrets.controller.ee.ts
Signals: Express
Excerpt (<=80 chars): export class ExternalSecretsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsController
```

--------------------------------------------------------------------------------

---[FILE: external-secrets.module.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/external-secrets.module.ts
Signals: N/A
Excerpt (<=80 chars): export class ExternalSecretsModule implements ModuleInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsModule
```

--------------------------------------------------------------------------------

---[FILE: external-secrets.service.ee.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/external-secrets.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class ExternalSecretsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SecretsProviderSettings<T = IDataObject> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecretsProviderState
- SecretsProviderSettings
- ExternalSecretsSettings
```

--------------------------------------------------------------------------------

---[FILE: unknown-auth-type.error.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/errors/unknown-auth-type.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UnknownAuthTypeError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnknownAuthTypeError
```

--------------------------------------------------------------------------------

---[FILE: aws-secrets-manager.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/providers/aws-secrets-manager.ts
Signals: N/A
Excerpt (<=80 chars):  export type AwsSecretsManagerContext = SecretsProviderSettings<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AwsSecretsManager
- AwsSecretsManagerContext
```

--------------------------------------------------------------------------------

---[FILE: infisical.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/providers/infisical.ts
Signals: N/A
Excerpt (<=80 chars):  export interface InfisicalSettings {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfisicalProvider
- InfisicalSettings
```

--------------------------------------------------------------------------------

---[FILE: vault.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/providers/vault.ts
Signals: N/A
Excerpt (<=80 chars):  export class VaultProvider extends SecretsProvider {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VaultProvider
```

--------------------------------------------------------------------------------

---[FILE: azure-key-vault.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/providers/azure-key-vault/azure-key-vault.ts
Signals: N/A
Excerpt (<=80 chars):  export class AzureKeyVault implements SecretsProvider {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AzureKeyVault
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/providers/azure-key-vault/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type AzureKeyVaultContext = SecretsProviderSettings<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AzureKeyVaultContext
```

--------------------------------------------------------------------------------

---[FILE: gcp-secrets-manager.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/providers/gcp-secrets-manager/gcp-secrets-manager.ts
Signals: N/A
Excerpt (<=80 chars):  export class GcpSecretsManager implements SecretsProvider {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GcpSecretsManager
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/modules/external-secrets.ee/providers/gcp-secrets-manager/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type GcpSecretsManagerContext = SecretsProviderSettings<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GcpSecretsManagerContext
- RawGcpSecretAccountKey
- GcpSecretAccountKey
```

--------------------------------------------------------------------------------

---[FILE: insights-collection.service.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights-collection.service.ts
Signals: N/A
Excerpt (<=80 chars): export class InsightsCollectionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsCollectionService
```

--------------------------------------------------------------------------------

---[FILE: insights-compaction.service.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights-compaction.service.ts
Signals: N/A
Excerpt (<=80 chars): export class InsightsCompactionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsCompactionService
```

--------------------------------------------------------------------------------

---[FILE: insights-pruning.service.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights-pruning.service.ts
Signals: N/A
Excerpt (<=80 chars): export class InsightsPruningService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsPruningService
```

--------------------------------------------------------------------------------

---[FILE: insights.config.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights.config.ts
Signals: N/A
Excerpt (<=80 chars): export class InsightsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsConfig
```

--------------------------------------------------------------------------------

---[FILE: insights.constants.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const INSIGHTS_DATE_RANGE_KEYS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INSIGHTS_DATE_RANGE_KEYS
```

--------------------------------------------------------------------------------

---[FILE: insights.controller.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights.controller.ts
Signals: Zod
Excerpt (<=80 chars): export class InsightsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsController
```

--------------------------------------------------------------------------------

---[FILE: insights.module.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights.module.ts
Signals: N/A
Excerpt (<=80 chars): export class InsightsModule implements ModuleInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsModule
```

--------------------------------------------------------------------------------

---[FILE: insights.service.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights.service.ts
Signals: N/A
Excerpt (<=80 chars): export class InsightsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsService
```

--------------------------------------------------------------------------------

---[FILE: insights.settings.ts]---
Location: n8n-master/packages/cli/src/modules/insights/insights.settings.ts
Signals: N/A
Excerpt (<=80 chars): export class InsightsSettings {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsSettings
```

--------------------------------------------------------------------------------

---[FILE: insights-by-period.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/entities/insights-by-period.ts
Signals: TypeORM
Excerpt (<=80 chars): export class InsightsByPeriod extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsByPeriod
```

--------------------------------------------------------------------------------

---[FILE: insights-metadata.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/entities/insights-metadata.ts
Signals: TypeORM
Excerpt (<=80 chars): export class InsightsMetadata extends BaseEntity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsMetadata
```

--------------------------------------------------------------------------------

---[FILE: insights-raw.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/entities/insights-raw.ts
Signals: TypeORM
Excerpt (<=80 chars):  export const { type: dbType } = Container.get(GlobalConfig).database;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsRaw
```

--------------------------------------------------------------------------------

---[FILE: insights-shared.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/entities/insights-shared.ts
Signals: N/A
Excerpt (<=80 chars): export const PeriodUnitToNumber = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isValidPeriodNumber
- isValidTypeNumber
- PeriodUnitToNumber
- NumberToPeriodUnit
- TypeToNumber
- NumberToType
- PeriodUnit
- PeriodUnitNumber
- TypeUnit
- TypeUnitNumber
```

--------------------------------------------------------------------------------

---[FILE: insights-by-period-query.helper.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/repositories/insights-by-period-query.helper.ts
Signals: N/A
Excerpt (<=80 chars): export const getDateRangesCommonTableExpressionQuery = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDateRangesSelectQuery
- getDateRangesCommonTableExpressionQuery
```

--------------------------------------------------------------------------------

---[FILE: insights-by-period.repository.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/repositories/insights-by-period.repository.ts
Signals: Zod, TypeORM
Excerpt (<=80 chars): export class InsightsByPeriodRepository extends Repository<InsightsByPeriod> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsByPeriodRepository
```

--------------------------------------------------------------------------------

---[FILE: insights-metadata.repository.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/repositories/insights-metadata.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class InsightsMetadataRepository extends Repository<InsightsMetadata> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsMetadataRepository
```

--------------------------------------------------------------------------------

---[FILE: insights-raw.repository.ts]---
Location: n8n-master/packages/cli/src/modules/insights/database/repositories/insights-raw.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class InsightsRawRepository extends Repository<InsightsRaw> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsRawRepository
```

--------------------------------------------------------------------------------

---[FILE: insights-by-period-migration.test.ts]---
Location: n8n-master/packages/cli/src/modules/insights/__tests__/insights-by-period-migration.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: insights-raw-migration.test.ts]---
Location: n8n-master/packages/cli/src/modules/insights/__tests__/insights-raw-migration.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: migration-test-setup.ts]---
Location: n8n-master/packages/cli/src/modules/insights/__tests__/migration-test-setup.ts
Signals: N/A
Excerpt (<=80 chars): export const BOUNDARY_TEST_VALUES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BOUNDARY_TEST_VALUES
```

--------------------------------------------------------------------------------

---[FILE: mcp-api-key.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp-api-key.service.ts
Signals: N/A
Excerpt (<=80 chars): export class McpServerApiKeyService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpServerApiKeyService
```

--------------------------------------------------------------------------------

---[FILE: mcp-oauth-authorization-code.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp-oauth-authorization-code.service.ts
Signals: N/A
Excerpt (<=80 chars): export class McpOAuthAuthorizationCodeService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpOAuthAuthorizationCodeService
```

--------------------------------------------------------------------------------

---[FILE: mcp-oauth-consent.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp-oauth-consent.service.ts
Signals: N/A
Excerpt (<=80 chars): export class McpOAuthConsentService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpOAuthConsentService
```

--------------------------------------------------------------------------------

---[FILE: mcp-oauth-service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp-oauth-service.ts
Signals: Express
Excerpt (<=80 chars):  export const SUPPORTED_SCOPES = ['tool:listWorkflows', 'tool:getWorkflowDeta...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SUPPORTED_SCOPES
- McpOAuthService
```

--------------------------------------------------------------------------------

---[FILE: mcp-oauth-token.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp-oauth-token.service.ts
Signals: N/A
Excerpt (<=80 chars): export class McpOAuthTokenService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpOAuthTokenService
```

--------------------------------------------------------------------------------

---[FILE: mcp-oauth.helpers.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp-oauth.helpers.ts
Signals: N/A
Excerpt (<=80 chars): export class McpOAuthHelpers {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpOAuthHelpers
```

--------------------------------------------------------------------------------

---[FILE: mcp-server-middleware.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp-server-middleware.service.ts
Signals: Express
Excerpt (<=80 chars): export class McpServerMiddlewareService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpServerMiddlewareService
```

--------------------------------------------------------------------------------

---[FILE: mcp.auth.consent.controller.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.auth.consent.controller.ts
Signals: Express
Excerpt (<=80 chars): export class McpConsentController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpConsentController
```

--------------------------------------------------------------------------------

---[FILE: mcp.constants.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const USER_CONNECTED_TO_MCP_EVENT = 'User connected to MCP server';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- USER_CONNECTED_TO_MCP_EVENT
- USER_CALLED_MCP_TOOL_EVENT
- UNAUTHORIZED_ERROR_MESSAGE
- INTERNAL_SERVER_ERROR_MESSAGE
- MCP_ACCESS_DISABLED_ERROR_MESSAGE
- SUPPORTED_MCP_TRIGGERS
```

--------------------------------------------------------------------------------

---[FILE: mcp.controller.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.controller.ts
Signals: Express
Excerpt (<=80 chars):  export type FlushableResponse = Response & { flush: () => void };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpController
- FlushableResponse
```

--------------------------------------------------------------------------------

---[FILE: mcp.errors.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.errors.ts
Signals: N/A
Excerpt (<=80 chars): export class McpExecutionTimeoutError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpExecutionTimeoutError
- JWTVerificationError
- AccessTokenNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: mcp.event-relay.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.event-relay.ts
Signals: N/A
Excerpt (<=80 chars): export class McpEventRelay extends EventRelay {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpEventRelay
```

--------------------------------------------------------------------------------

---[FILE: mcp.module.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.module.ts
Signals: N/A
Excerpt (<=80 chars): export class McpModule implements ModuleInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpModule
```

--------------------------------------------------------------------------------

---[FILE: mcp.oauth-clients.controller.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.oauth-clients.controller.ts
Signals: Express
Excerpt (<=80 chars): export class McpOAuthClientsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpOAuthClientsController
```

--------------------------------------------------------------------------------

---[FILE: mcp.oauth.controller.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.oauth.controller.ts
Signals: Express
Excerpt (<=80 chars): export class McpOAuthController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpOAuthController
```

--------------------------------------------------------------------------------

---[FILE: mcp.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.service.ts
Signals: N/A
Excerpt (<=80 chars): export class McpService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpService
```

--------------------------------------------------------------------------------

---[FILE: mcp.settings.controller.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.settings.controller.ts
Signals: Express
Excerpt (<=80 chars): export class McpSettingsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpSettingsController
```

--------------------------------------------------------------------------------

---[FILE: mcp.settings.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.settings.service.ts
Signals: N/A
Excerpt (<=80 chars): export class McpSettingsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpSettingsService
```

--------------------------------------------------------------------------------

---[FILE: mcp.typeguards.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.typeguards.ts
Signals: N/A
Excerpt (<=80 chars):  export type HttpHeaderAuthDecryptedData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isRecord
- hasHttpHeaderAuthDecryptedData
- hasJwtSecretDecryptedData
- hasJwtPemKeyDecryptedData
- isJSONRPCRequest
- HttpHeaderAuthDecryptedData
- WithDecryptedData
- JwtPassphraseDecryptedData
- JwtPemKeyDecryptedData
```

--------------------------------------------------------------------------------

---[FILE: mcp.types.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.types.ts
Signals: Zod
Excerpt (<=80 chars):  export type ToolDefinition<InputArgs extends z.ZodRawShape = z.ZodRawShape> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolDefinition
- SearchWorkflowsParams
- SearchWorkflowsItem
- SearchWorkflowsResult
- WorkflowDetailsResult
- WorkflowDetailsWorkflow
- WorkflowDetailsNode
- JSONRPCRequest
- UserConnectedToMCPEventPayload
- UserCalledMCPToolEventPayload
- ExecuteWorkflowsInputMeta
- MCPTriggersMap
- AuthFailureReason
- Mcpauth_type
- TelemetryAuthContext
- UserWithContext
```

--------------------------------------------------------------------------------

---[FILE: mcp.utils.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/mcp.utils.ts
Signals: Express
Excerpt (<=80 chars):  export const getClientInfo = (req: Request | AuthenticatedRequest) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getClientInfo
- getToolName
- getToolArguments
- findMcpSupportedTrigger
```

--------------------------------------------------------------------------------

---[FILE: oauth-session.service.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/oauth-session.service.ts
Signals: Express
Excerpt (<=80 chars):  export interface OAuthSessionPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuthSessionService
- OAuthSessionPayload
```

--------------------------------------------------------------------------------

---[FILE: oauth-access-token.entity.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/entities/oauth-access-token.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AccessToken {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AccessToken
```

--------------------------------------------------------------------------------

---[FILE: oauth-authorization-code.entity.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/entities/oauth-authorization-code.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AuthorizationCode extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthorizationCode
```

--------------------------------------------------------------------------------

---[FILE: oauth-client.entity.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/entities/oauth-client.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class OAuthClient extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuthClient
```

--------------------------------------------------------------------------------

---[FILE: oauth-refresh-token.entity.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/entities/oauth-refresh-token.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class RefreshToken extends WithTimestamps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RefreshToken
```

--------------------------------------------------------------------------------

---[FILE: oauth-user-consent.entity.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/entities/oauth-user-consent.entity.ts
Signals: TypeORM
Excerpt (<=80 chars): export class UserConsent {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserConsent
```

--------------------------------------------------------------------------------

---[FILE: oauth-access-token.repository.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/repositories/oauth-access-token.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AccessTokenRepository extends Repository<AccessToken> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AccessTokenRepository
```

--------------------------------------------------------------------------------

---[FILE: oauth-authorization-code.repository.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/repositories/oauth-authorization-code.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AuthorizationCodeRepository extends Repository<AuthorizationCode> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthorizationCodeRepository
```

--------------------------------------------------------------------------------

---[FILE: oauth-client.repository.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/repositories/oauth-client.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class OAuthClientRepository extends Repository<OAuthClient> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuthClientRepository
```

--------------------------------------------------------------------------------

---[FILE: oauth-refresh-token.repository.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/repositories/oauth-refresh-token.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class RefreshTokenRepository extends Repository<RefreshToken> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RefreshTokenRepository
```

--------------------------------------------------------------------------------

---[FILE: oauth-user-consent.repository.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/database/repositories/oauth-user-consent.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class UserConsentRepository extends Repository<UserConsent> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserConsentRepository
```

--------------------------------------------------------------------------------

---[FILE: approve-consent-request.dto.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/dto/approve-consent-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ApproveConsentRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApproveConsentRequestDto
```

--------------------------------------------------------------------------------

---[FILE: update-mcp-settings.dto.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/dto/update-mcp-settings.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateMcpSettingsDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateMcpSettingsDto
```

--------------------------------------------------------------------------------

---[FILE: update-workflow-availability.dto.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/dto/update-workflow-availability.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateWorkflowAvailabilityDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateWorkflowAvailabilityDto
```

--------------------------------------------------------------------------------

---[FILE: execute-workflow.tool.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/tools/execute-workflow.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const createExecuteWorkflowTool = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createExecuteWorkflowTool
- executeWorkflow
```

--------------------------------------------------------------------------------

---[FILE: get-workflow-details.tool.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/tools/get-workflow-details.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export type WorkflowDetailsOutputSchema = typeof workflowDetailsOutputSchema;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createWorkflowDetailsTool
- WorkflowDetailsOutputSchema
```

--------------------------------------------------------------------------------

---[FILE: schemas.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/tools/schemas.ts
Signals: Zod
Excerpt (<=80 chars):  export const nodeSchema = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodeSchema
- tagSchema
- workflowSettingsSchema
- workflowMetaSchema
- workflowDetailsOutputSchema
```

--------------------------------------------------------------------------------

---[FILE: search-workflows.tool.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/tools/search-workflows.tool.ts
Signals: Zod
Excerpt (<=80 chars): export const createSearchWorkflowsTool = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createSearchWorkflowsTool
```

--------------------------------------------------------------------------------

---[FILE: webhook-utils.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/tools/webhook-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type WebhookEndpoints = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildWebhookPath
- getTriggerDetails
- getWebhookDetails
- WebhookEndpoints
```

--------------------------------------------------------------------------------

---[FILE: mcp-oauth-service.test.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/__tests__/mcp-oauth-service.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mcp-server-middleware.service.test.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/__tests__/mcp-server-middleware.service.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockInstance } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mcp.controller.test.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/__tests__/mcp.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mcp.settings.controller.test.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/__tests__/mcp.settings.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger, ModuleRegistry } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mcp.utils.test.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/__tests__/mcp.utils.test.ts
Signals: Express
Excerpt (<=80 chars): import type { AuthenticatedRequest } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mock.utils.ts]---
Location: n8n-master/packages/cli/src/modules/mcp/__tests__/mock.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const createWorkflow = (overrides: Partial<WorkflowEntity> = {}): Wor...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createWorkflow
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/modules/provisioning.ee/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const PROVISIONING_PREFERENCES_DB_KEY = 'features.provisioning';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PROVISIONING_PREFERENCES_DB_KEY
```

--------------------------------------------------------------------------------

---[FILE: provisioning.controller.ee.ts]---
Location: n8n-master/packages/cli/src/modules/provisioning.ee/provisioning.controller.ee.ts
Signals: Express
Excerpt (<=80 chars): export class ProvisioningController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvisioningController
```

--------------------------------------------------------------------------------

---[FILE: provisioning.module.ts]---
Location: n8n-master/packages/cli/src/modules/provisioning.ee/provisioning.module.ts
Signals: N/A
Excerpt (<=80 chars): export class ProvisioningModule implements ModuleInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvisioningModule
```

--------------------------------------------------------------------------------

---[FILE: provisioning.service.ee.ts]---
Location: n8n-master/packages/cli/src/modules/provisioning.ee/provisioning.service.ee.ts
Signals: Zod
Excerpt (<=80 chars): export class ProvisioningService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvisioningService
```

--------------------------------------------------------------------------------

---[FILE: provisioning.controller.ee.test.ts]---
Location: n8n-master/packages/cli/src/modules/provisioning.ee/__tests__/provisioning.controller.ee.test.ts
Signals: Express
Excerpt (<=80 chars): import type { LicenseState } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
