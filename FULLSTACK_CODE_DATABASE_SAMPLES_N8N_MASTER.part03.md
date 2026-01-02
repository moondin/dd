---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 3
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 3 of 51)

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

---[FILE: frontend-settings.ts]---
Location: n8n-master/packages/@n8n/api-types/src/frontend-settings.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IVersionNotificationSettings {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthenticationMethod
- FrontendModuleSettings
- N8nEnvFeatFlagValue
- N8nEnvFeatFlags
- IVersionNotificationSettings
- ITelemetryClientConfig
- ITelemetrySettings
- IUserManagementSettings
- IEnterpriseSettings
- FrontendSettings
```

--------------------------------------------------------------------------------

---[FILE: scaling.ts]---
Location: n8n-master/packages/@n8n/api-types/src/scaling.ts
Signals: N/A
Excerpt (<=80 chars):  export type RunningJobSummary = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RunningJobSummary
- WorkerStatus
```

--------------------------------------------------------------------------------

---[FILE: user.ts]---
Location: n8n-master/packages/@n8n/api-types/src/user.ts
Signals: N/A
Excerpt (<=80 chars): export type MinimalUser = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MinimalUser
```

--------------------------------------------------------------------------------

---[FILE: ai-apply-suggestion-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/ai/ai-apply-suggestion-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AiApplySuggestionRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiApplySuggestionRequestDto
```

--------------------------------------------------------------------------------

---[FILE: ai-ask-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/ai/ai-ask-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AiAskRequestDto

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiAskRequestDto
```

--------------------------------------------------------------------------------

---[FILE: ai-build-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/ai/ai-build-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export interface ExpressionValue {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiBuilderChatRequestDto
- ExpressionValue
```

--------------------------------------------------------------------------------

---[FILE: ai-chat-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/ai/ai-chat-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AiChatRequestDto

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiChatRequestDto
```

--------------------------------------------------------------------------------

---[FILE: ai-free-credits-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/ai/ai-free-credits-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AiFreeCreditsRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiFreeCreditsRequestDto
```

--------------------------------------------------------------------------------

---[FILE: ai-session-metadata-response.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/ai/ai-session-metadata-response.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AiSessionMetadataResponseDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiSessionMetadataResponseDto
```

--------------------------------------------------------------------------------

---[FILE: ai-session-retrieval-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/ai/ai-session-retrieval-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AiSessionRetrievalRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiSessionRetrievalRequestDto
```

--------------------------------------------------------------------------------

---[FILE: create-api-key-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/api-keys/create-api-key-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateApiKeyRequestDto extends UpdateApiKeyRequestDto.extend({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateApiKeyRequestDto
```

--------------------------------------------------------------------------------

---[FILE: update-api-key-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/api-keys/update-api-key-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateApiKeyRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateApiKeyRequestDto
```

--------------------------------------------------------------------------------

---[FILE: login-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/auth/login-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class LoginRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginRequestDto
```

--------------------------------------------------------------------------------

---[FILE: resolve-signup-token-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/auth/resolve-signup-token-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ResolveSignupTokenQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolveSignupTokenQueryDto
```

--------------------------------------------------------------------------------

---[FILE: binary-data-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/binary-data/binary-data-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class BinaryDataQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BinaryDataQueryDto
```

--------------------------------------------------------------------------------

---[FILE: binary-data-signed-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/binary-data/binary-data-signed-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class BinaryDataSignedQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BinaryDataSignedQueryDto
```

--------------------------------------------------------------------------------

---[FILE: create-credential-resolver.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/credential-resolver/create-credential-resolver.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateCredentialResolverDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialResolverDto
```

--------------------------------------------------------------------------------

---[FILE: update-credential-resolver.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/credential-resolver/update-credential-resolver.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateCredentialResolverDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateCredentialResolverDto
```

--------------------------------------------------------------------------------

---[FILE: create-credential.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/credentials/create-credential.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateCredentialDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialDto
```

--------------------------------------------------------------------------------

---[FILE: credentials-get-many-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/credentials/credentials-get-many-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CredentialsGetManyRequestQuery extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsGetManyRequestQuery
```

--------------------------------------------------------------------------------

---[FILE: credentials-get-one-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/credentials/credentials-get-one-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CredentialsGetOneRequestQuery extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsGetOneRequestQuery
```

--------------------------------------------------------------------------------

---[FILE: generate-credential-name.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/credentials/generate-credential-name.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class GenerateCredentialNameRequestQuery extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateCredentialNameRequestQuery
```

--------------------------------------------------------------------------------

---[FILE: add-data-table-column.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/add-data-table-column.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AddDataTableColumnDto extends Z.class(dataTableCreateColumnSche...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddDataTableColumnDto
```

--------------------------------------------------------------------------------

---[FILE: add-data-table-rows.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/add-data-table-rows.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AddDataTableRowsDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddDataTableRowsDto
```

--------------------------------------------------------------------------------

---[FILE: create-data-table-column.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/create-data-table-column.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateDataTableColumnDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateDataTableColumnDto
```

--------------------------------------------------------------------------------

---[FILE: create-data-table.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/create-data-table.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateDataTableDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateDataTableDto
```

--------------------------------------------------------------------------------

---[FILE: delete-data-table-rows.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/delete-data-table-rows.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class DeleteDataTableRowsDto extends Z.class(deleteDataTableRowsShape...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteDataTableRowsDto
```

--------------------------------------------------------------------------------

---[FILE: list-data-table-content-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/list-data-table-content-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ListDataTableContentQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListDataTableContentQueryDto
```

--------------------------------------------------------------------------------

---[FILE: list-data-table-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/list-data-table-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export type ListDataTableQuerySortOptions = (typeof VALID_SORT_OPTIONS)[numb...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListDataTableQueryDto
- ListDataTableQuerySortOptions
```

--------------------------------------------------------------------------------

---[FILE: move-data-table-column.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/move-data-table-column.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class MoveDataTableColumnDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MoveDataTableColumnDto
```

--------------------------------------------------------------------------------

---[FILE: rename-data-table-column.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/rename-data-table-column.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class RenameDataTableColumnDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenameDataTableColumnDto
```

--------------------------------------------------------------------------------

---[FILE: update-data-table-row.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/update-data-table-row.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateDataTableRowDto extends Z.class(updateDataTableRowShape) {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateDataTableRowDto
```

--------------------------------------------------------------------------------

---[FILE: update-data-table.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/update-data-table.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateDataTableDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateDataTableDto
```

--------------------------------------------------------------------------------

---[FILE: upsert-data-table-row.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/data-table/upsert-data-table-row.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpsertDataTableRowDto extends Z.class(upsertDataTableRowShape) {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpsertDataTableRowDto
```

--------------------------------------------------------------------------------

---[FILE: action-result-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/dynamic-node-parameters/action-result-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ActionResultRequestDto extends BaseDynamicParametersRequestDto....

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionResultRequestDto
```

--------------------------------------------------------------------------------

---[FILE: base-dynamic-parameters-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/dynamic-node-parameters/base-dynamic-parameters-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class BaseDynamicParametersRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseDynamicParametersRequestDto
```

--------------------------------------------------------------------------------

---[FILE: options-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/dynamic-node-parameters/options-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class OptionsRequestDto extends BaseDynamicParametersRequestDto.extend({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OptionsRequestDto
```

--------------------------------------------------------------------------------

---[FILE: resource-locator-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/dynamic-node-parameters/resource-locator-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ResourceLocatorRequestDto extends BaseDynamicParametersRequestD...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResourceLocatorRequestDto
```

--------------------------------------------------------------------------------

---[FILE: resource-mapper-fields-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/dynamic-node-parameters/resource-mapper-fields-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ResourceMapperFieldsRequestDto extends BaseDynamicParametersReq...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResourceMapperFieldsRequestDto
```

--------------------------------------------------------------------------------

---[FILE: create-folder.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/folders/create-folder.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateFolderDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateFolderDto
```

--------------------------------------------------------------------------------

---[FILE: delete-folder.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/folders/delete-folder.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class DeleteFolderDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteFolderDto
```

--------------------------------------------------------------------------------

---[FILE: list-folder-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/folders/list-folder-query.dto.ts
Signals: Zod
Excerpt (<=80 chars): export const filterSchema = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filterSchema
- ListFolderQueryDto
```

--------------------------------------------------------------------------------

---[FILE: transfer-folder.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/folders/transfer-folder.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class TransferFolderBodyDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TransferFolderBodyDto
```

--------------------------------------------------------------------------------

---[FILE: update-folder.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/folders/update-folder.dto.ts
Signals: Zod
Excerpt (<=80 chars): export class UpdateFolderDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateFolderDto
```

--------------------------------------------------------------------------------

---[FILE: date-filter.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/insights/date-filter.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class InsightsDateFilterDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsDateFilterDto
```

--------------------------------------------------------------------------------

---[FILE: list-workflow-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/insights/list-workflow-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export const MAX_ITEMS_PER_PAGE = 100;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_ITEMS_PER_PAGE
- ListInsightsWorkflowQueryDto
```

--------------------------------------------------------------------------------

---[FILE: accept-invitation-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/invitation/accept-invitation-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AcceptInvitationRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AcceptInvitationRequestDto
```

--------------------------------------------------------------------------------

---[FILE: invite-users-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/invitation/invite-users-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class InviteUsersRequestDto extends Array<z.infer<typeof invitedUserS...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InviteUsersRequestDto
```

--------------------------------------------------------------------------------

---[FILE: community-registered-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/license/community-registered-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CommunityRegisteredRequestDto extends Z.class({ email: z.string...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommunityRegisteredRequestDto
```

--------------------------------------------------------------------------------

---[FILE: oauth-client.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/oauth/oauth-client.dto.ts
Signals: Zod
Excerpt (<=80 chars): export class OAuthClientResponseDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuthClientResponseDto
- ListOAuthClientsResponseDto
- DeleteOAuthClientResponseDto
```

--------------------------------------------------------------------------------

---[FILE: config.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/oidc/config.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class OidcConfigDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OidcConfigDto
```

--------------------------------------------------------------------------------

---[FILE: dismiss-banner-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/owner/dismiss-banner-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class DismissBannerRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DismissBannerRequestDto
```

--------------------------------------------------------------------------------

---[FILE: owner-setup-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/owner/owner-setup-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class OwnerSetupRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OwnerSetupRequestDto
```

--------------------------------------------------------------------------------

---[FILE: pagination.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/pagination/pagination.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export const MAX_ITEMS_PER_PAGE = 50;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_ITEMS_PER_PAGE
- createTakeValidator
- paginationSchema
- PaginationDto
```

--------------------------------------------------------------------------------

---[FILE: change-password-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/password-reset/change-password-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ChangePasswordRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangePasswordRequestDto
```

--------------------------------------------------------------------------------

---[FILE: forgot-password-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/password-reset/forgot-password-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ForgotPasswordRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ForgotPasswordRequestDto
```

--------------------------------------------------------------------------------

---[FILE: resolve-password-token-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/password-reset/resolve-password-token-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ResolvePasswordTokenQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolvePasswordTokenQueryDto
```

--------------------------------------------------------------------------------

---[FILE: add-users-to-project.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/project/add-users-to-project.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class AddUsersToProjectDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddUsersToProjectDto
```

--------------------------------------------------------------------------------

---[FILE: change-user-role-in-project.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/project/change-user-role-in-project.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ChangeUserRoleInProject extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeUserRoleInProject
```

--------------------------------------------------------------------------------

---[FILE: create-project.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/project/create-project.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateProjectDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateProjectDto
```

--------------------------------------------------------------------------------

---[FILE: delete-project.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/project/delete-project.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class DeleteProjectDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteProjectDto
```

--------------------------------------------------------------------------------

---[FILE: update-project.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/project/update-project.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateProjectDto extends Z.class(updateProjectShape) {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateProjectDto
- UpdateProjectWithRelationsDto
```

--------------------------------------------------------------------------------

---[FILE: config.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/provisioning/config.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ProvisioningConfigDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvisioningConfigDto
- ProvisioningConfigPatchDto
```

--------------------------------------------------------------------------------

---[FILE: create-role.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/roles/create-role.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateRoleDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRoleDto
```

--------------------------------------------------------------------------------

---[FILE: role-get-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/roles/role-get-query.dto.ts
Signals: Zod
Excerpt (<=80 chars): export class RoleGetQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoleGetQueryDto
```

--------------------------------------------------------------------------------

---[FILE: role-list-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/roles/role-list-query.dto.ts
Signals: Zod
Excerpt (<=80 chars): export class RoleListQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoleListQueryDto
```

--------------------------------------------------------------------------------

---[FILE: update-role.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/roles/update-role.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateRoleDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateRoleDto
```

--------------------------------------------------------------------------------

---[FILE: create-role.dto.test.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/roles/__tests__/create-role.dto.test.ts
Signals: Zod
Excerpt (<=80 chars): import { ALL_SCOPES } from '@n8n/permissions';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: update-role.dto.test.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/roles/__tests__/update-role.dto.test.ts
Signals: Zod
Excerpt (<=80 chars): import { ALL_SCOPES } from '@n8n/permissions';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: saml-acs.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/saml/saml-acs.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class SamlAcsDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamlAcsDto
```

--------------------------------------------------------------------------------

---[FILE: saml-preferences.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/saml/saml-preferences.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class SamlPreferencesAttributeMapping extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamlPreferencesAttributeMapping
- SamlPreferences
```

--------------------------------------------------------------------------------

---[FILE: saml-toggle.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/saml/saml-toggle.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class SamlToggleDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamlToggleDto
```

--------------------------------------------------------------------------------

---[FILE: pull-work-folder-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/source-control/pull-work-folder-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class PullWorkFolderRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullWorkFolderRequestDto
```

--------------------------------------------------------------------------------

---[FILE: push-work-folder-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/source-control/push-work-folder-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class PushWorkFolderRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushWorkFolderRequestDto
```

--------------------------------------------------------------------------------

---[FILE: create-or-update-tag-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/tag/create-or-update-tag-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateOrUpdateTagRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateOrUpdateTagRequestDto
```

--------------------------------------------------------------------------------

---[FILE: retrieve-tag-query.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/tag/retrieve-tag-query.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class RetrieveTagQueryDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetrieveTagQueryDto
```

--------------------------------------------------------------------------------

---[FILE: password-update-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/user/password-update-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class PasswordUpdateRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordUpdateRequestDto
```

--------------------------------------------------------------------------------

---[FILE: role-change-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/user/role-change-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class RoleChangeRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoleChangeRequestDto
```

--------------------------------------------------------------------------------

---[FILE: settings-update-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/user/settings-update-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class SettingsUpdateRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsUpdateRequestDto
```

--------------------------------------------------------------------------------

---[FILE: user-update-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/user/user-update-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UserUpdateRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserUpdateRequestDto
```

--------------------------------------------------------------------------------

---[FILE: users-list-filter.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/user/users-list-filter.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export const USERS_LIST_SORT_OPTIONS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- USERS_LIST_SORT_OPTIONS
- UsersListFilterDto
- UsersListSortOptions
```

--------------------------------------------------------------------------------

---[FILE: base.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/variables/base.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export const KEY_NAME_REGEX = /^[A-Za-z0-9_]+$/;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KEY_NAME_REGEX
- KEY_MAX_LENGTH
- VALUE_MAX_LENGTH
- TYPE_ENUM
- variableKeySchema
- variableValueSchema
- variableTypeSchema
- BaseVariableRequestDto
```

--------------------------------------------------------------------------------

---[FILE: create-variable-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/variables/create-variable-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class CreateVariableRequestDto extends BaseVariableRequestDto.extend({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateVariableRequestDto
```

--------------------------------------------------------------------------------

---[FILE: update-variable-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/variables/update-variable-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class UpdateVariableRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateVariableRequestDto
```

--------------------------------------------------------------------------------

---[FILE: variables-list-request.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/variables/variables-list-request.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class VariableListRequestDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VariableListRequestDto
```

--------------------------------------------------------------------------------

---[FILE: activate-workflow.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/workflows/activate-workflow.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ActivateWorkflowDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActivateWorkflowDto
```

--------------------------------------------------------------------------------

---[FILE: import-workflow-from-url.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/workflows/import-workflow-from-url.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class ImportWorkflowFromUrlDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportWorkflowFromUrlDto
```

--------------------------------------------------------------------------------

---[FILE: transfer.dto.ts]---
Location: n8n-master/packages/@n8n/api-types/src/dto/workflows/transfer.dto.ts
Signals: Zod
Excerpt (<=80 chars):  export class TransferWorkflowBodyDto extends Z.class({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TransferWorkflowBodyDto
```

--------------------------------------------------------------------------------

---[FILE: builder-credits.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/builder-credits.ts
Signals: N/A
Excerpt (<=80 chars): export type BuilderCreditsPushMessage = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BuilderCreditsPushMessage
```

--------------------------------------------------------------------------------

---[FILE: collaboration.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/collaboration.ts
Signals: N/A
Excerpt (<=80 chars):  export type Collaborator = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Collaborator
- CollaboratorsChanged
- CollaborationPushMessage
```

--------------------------------------------------------------------------------

---[FILE: debug.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/debug.ts
Signals: N/A
Excerpt (<=80 chars): export type SendConsoleMessage = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SendConsoleMessage
- DebugPushMessage
```

--------------------------------------------------------------------------------

---[FILE: execution.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/execution.ts
Signals: N/A
Excerpt (<=80 chars):  export type ExecutionStarted = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionStarted
- ExecutionWaiting
- ExecutionFinished
- ExecutionRecovered
- NodeExecuteBefore
- NodeExecuteAfter
- NodeExecuteAfterData
- ExecutionPushMessage
```

--------------------------------------------------------------------------------

---[FILE: heartbeat.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/heartbeat.ts
Signals: Zod
Excerpt (<=80 chars):  export const heartbeatMessageSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- heartbeatMessageSchema
- createHeartbeatMessage
- HeartbeatMessage
```

--------------------------------------------------------------------------------

---[FILE: hot-reload.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/hot-reload.ts
Signals: N/A
Excerpt (<=80 chars): export type NodeTypeData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypeData
- ReloadNodeType
- RemoveNodeType
- NodeDescriptionUpdated
- HotReloadPushMessage
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type PushMessage =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushMessage
- PushType
- PushPayload
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: n8n-master/packages/@n8n/api-types/src/push/webhook.ts
Signals: N/A
Excerpt (<=80 chars): export type TestWebhookDeleted = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestWebhookDeleted
- TestWebhookReceived
- WebhookPushMessage
```

--------------------------------------------------------------------------------

````
