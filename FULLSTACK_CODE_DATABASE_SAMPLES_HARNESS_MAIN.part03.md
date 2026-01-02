---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 3
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 3 of 37)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - harness-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/harness-main
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: security_update.go]---
Location: harness-main/app/api/controller/reposettings/security_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) SecurityUpdate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityUpdate
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/reposettings/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/secret/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/secret/create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- sanitizeCreateInput
- enc
- Dec
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/secret/delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Delete(ctx context.Context, session *auth.Session, spac...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/secret/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/secret/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/secret/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/service/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- findServiceFromUID
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/service/create.go
Signals: N/A
Excerpt (<=80 chars): type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- CreateNoAuth
- sanitizeCreateInput
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/service/delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Delete(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/service/find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Find(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
- FindNoAuth
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/service/list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) List(ctx context.Context, session *auth.Session) (int64,...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/service/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: update_admin.go]---
Location: harness-main/app/api/controller/service/update_admin.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UpdateAdmin(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateAdmin
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/service/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(principalUIDCheck check.PrincipalUID, authorizer auth...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/serviceaccount/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- findServiceAccountFromUID
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/serviceaccount/create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- CreateNoAuth
- sanitizeCreateInput
- generateServiceAccountUID
```

--------------------------------------------------------------------------------

---[FILE: create_token.go]---
Location: harness-main/app/api/controller/serviceaccount/create_token.go
Signals: N/A
Excerpt (<=80 chars):  type CreateTokenInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTokenInput
- CreateToken
- sanitizeCreateTokenInput
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/serviceaccount/delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Delete(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: delete_token.go]---
Location: harness-main/app/api/controller/serviceaccount/delete_token.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteToken(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteToken
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/serviceaccount/find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
- FindNoAuth
```

--------------------------------------------------------------------------------

---[FILE: list_token.go]---
Location: harness-main/app/api/controller/serviceaccount/list_token.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListTokens(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListTokens
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/serviceaccount/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(principalUIDCheck check.PrincipalUID, authorizer auth...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/space/controller.go
Signals: N/A
Excerpt (<=80 chars): type SpaceOutput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpaceOutput
- MarshalJSON
- NewController
- getSpaceCheckAuth
- getSpaceCheckAuthRepoCreation
- getSpaceCheckAuthSpaceCreation
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/space/create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- createSpaceInnerInTX
- sanitizeCreateInput
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/api/controller/space/events.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Events(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Events
```

--------------------------------------------------------------------------------

---[FILE: export.go]---
Location: harness-main/app/api/controller/space/export.go
Signals: N/A
Excerpt (<=80 chars):  type ExportInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportInput
- Export
- sanitizeExportInput
```

--------------------------------------------------------------------------------

---[FILE: export_progress.go]---
Location: harness-main/app/api/controller/space/export_progress.go
Signals: N/A
Excerpt (<=80 chars):  type ExportProgressOutput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportProgressOutput
- ExportProgress
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/space/find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Find(ctx context.Context, session *auth.Session, spaceRe...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/app/api/controller/space/helper.go
Signals: N/A
Excerpt (<=80 chars): func GetSpaceCheckAuth(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetSpaceCheckAuth
- GetSpaceOutput
```

--------------------------------------------------------------------------------

---[FILE: import.go]---
Location: harness-main/app/api/controller/space/import.go
Signals: N/A
Excerpt (<=80 chars):  type ProviderInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProviderInput
- ImportInput
- Import
- sanitizeImportInput
```

--------------------------------------------------------------------------------

---[FILE: import_repositories.go]---
Location: harness-main/app/api/controller/space/import_repositories.go
Signals: N/A
Excerpt (<=80 chars):  type ImportRepositoriesInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportRepositoriesInput
- ImportRepositoriesOutput
- ImportRepositories
```

--------------------------------------------------------------------------------

---[FILE: label_define.go]---
Location: harness-main/app/api/controller/space/label_define.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DefineLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefineLabel
```

--------------------------------------------------------------------------------

---[FILE: label_delete.go]---
Location: harness-main/app/api/controller/space/label_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteLabel
```

--------------------------------------------------------------------------------

---[FILE: label_find.go]---
Location: harness-main/app/api/controller/space/label_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FindLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindLabel
```

--------------------------------------------------------------------------------

---[FILE: label_list.go]---
Location: harness-main/app/api/controller/space/label_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListLabels(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListLabels
```

--------------------------------------------------------------------------------

---[FILE: label_save.go]---
Location: harness-main/app/api/controller/space/label_save.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) SaveLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SaveLabel
```

--------------------------------------------------------------------------------

---[FILE: label_update.go]---
Location: harness-main/app/api/controller/space/label_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UpdateLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateLabel
```

--------------------------------------------------------------------------------

---[FILE: label_value_define.go]---
Location: harness-main/app/api/controller/space/label_value_define.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DefineLabelValue(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefineLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_delete.go]---
Location: harness-main/app/api/controller/space/label_value_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteLabelValue(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_list.go]---
Location: harness-main/app/api/controller/space/label_value_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListLabelValues(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListLabelValues
```

--------------------------------------------------------------------------------

---[FILE: label_value_update.go]---
Location: harness-main/app/api/controller/space/label_value_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UpdateLabelValue(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateLabelValue
```

--------------------------------------------------------------------------------

---[FILE: list_connectors.go]---
Location: harness-main/app/api/controller/space/list_connectors.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListConnectors(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListConnectors
```

--------------------------------------------------------------------------------

---[FILE: list_executions.go]---
Location: harness-main/app/api/controller/space/list_executions.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListExecutions(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListExecutions
```

--------------------------------------------------------------------------------

---[FILE: list_gitspaces.go]---
Location: harness-main/app/api/controller/space/list_gitspaces.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) ListGitspaces(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListGitspaces
```

--------------------------------------------------------------------------------

---[FILE: list_pipelines.go]---
Location: harness-main/app/api/controller/space/list_pipelines.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListPipelines(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPipelines
```

--------------------------------------------------------------------------------

---[FILE: list_repositories.go]---
Location: harness-main/app/api/controller/space/list_repositories.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListRepositories(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListRepositories
- ListRepositoriesNoAuth
```

--------------------------------------------------------------------------------

---[FILE: list_secrets.go]---
Location: harness-main/app/api/controller/space/list_secrets.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListSecrets(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListSecrets
```

--------------------------------------------------------------------------------

---[FILE: list_service_accounts.go]---
Location: harness-main/app/api/controller/space/list_service_accounts.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListServiceAccounts(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListServiceAccounts
```

--------------------------------------------------------------------------------

---[FILE: list_spaces.go]---
Location: harness-main/app/api/controller/space/list_spaces.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListSpaces(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListSpaces
- ListSpacesNoAuth
```

--------------------------------------------------------------------------------

---[FILE: list_templates.go]---
Location: harness-main/app/api/controller/space/list_templates.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListTemplates(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListTemplates
```

--------------------------------------------------------------------------------

---[FILE: membership_add.go]---
Location: harness-main/app/api/controller/space/membership_add.go
Signals: N/A
Excerpt (<=80 chars):  type MembershipAddInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipAddInput
- Validate
- MembershipAdd
```

--------------------------------------------------------------------------------

---[FILE: membership_delete.go]---
Location: harness-main/app/api/controller/space/membership_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) MembershipDelete(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipDelete
```

--------------------------------------------------------------------------------

---[FILE: membership_list.go]---
Location: harness-main/app/api/controller/space/membership_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) MembershipList(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipList
```

--------------------------------------------------------------------------------

---[FILE: membership_update.go]---
Location: harness-main/app/api/controller/space/membership_update.go
Signals: N/A
Excerpt (<=80 chars):  type MembershipUpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipUpdateInput
- Validate
- MembershipUpdate
```

--------------------------------------------------------------------------------

---[FILE: move.go]---
Location: harness-main/app/api/controller/space/move.go
Signals: N/A
Excerpt (<=80 chars): type MoveInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MoveInput
- hasChanges
- Move
- sanitizeMoveInput
```

--------------------------------------------------------------------------------

---[FILE: pr_count.go]---
Location: harness-main/app/api/controller/space/pr_count.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) CountPullReqs(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CountPullReqs
```

--------------------------------------------------------------------------------

---[FILE: pr_list.go]---
Location: harness-main/app/api/controller/space/pr_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListPullReqs(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPullReqs
```

--------------------------------------------------------------------------------

---[FILE: purge.go]---
Location: harness-main/app/api/controller/space/purge.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Purge(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Purge
- PurgeNoAuth
- purgeSpaceInnerInTx
```

--------------------------------------------------------------------------------

---[FILE: restore.go]---
Location: harness-main/app/api/controller/space/restore.go
Signals: N/A
Excerpt (<=80 chars):  type RestoreInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestoreInput
- Restore
- restoreSpaceInnerInTx
- restoreNoAuth
- restoreRepositoriesNoAuth
- getParentSpace
- sanitizeRestoreInput
```

--------------------------------------------------------------------------------

---[FILE: rule_create.go]---
Location: harness-main/app/api/controller/space/rule_create.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleCreate(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleCreate
```

--------------------------------------------------------------------------------

---[FILE: rule_delete.go]---
Location: harness-main/app/api/controller/space/rule_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleDelete(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleDelete
```

--------------------------------------------------------------------------------

---[FILE: rule_find.go]---
Location: harness-main/app/api/controller/space/rule_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleFind(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleFind
```

--------------------------------------------------------------------------------

---[FILE: rule_list.go]---
Location: harness-main/app/api/controller/space/rule_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleList(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleList
```

--------------------------------------------------------------------------------

---[FILE: rule_update.go]---
Location: harness-main/app/api/controller/space/rule_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleUpdate(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleUpdate
```

--------------------------------------------------------------------------------

---[FILE: soft_delete.go]---
Location: harness-main/app/api/controller/space/soft_delete.go
Signals: N/A
Excerpt (<=80 chars):  type SoftDeleteResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SoftDeleteResponse
- SoftDelete
- SoftDeleteNoAuth
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/space/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- hasChanges
- Update
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: update_public_access.go]---
Location: harness-main/app/api/controller/space/update_public_access.go
Signals: N/A
Excerpt (<=80 chars):  type UpdatePublicAccessInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdatePublicAccessInput
- UpdatePublicAccess
```

--------------------------------------------------------------------------------

---[FILE: usage.go]---
Location: harness-main/app/api/controller/space/usage.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) GetUsageMetrics(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetUsageMetrics
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/space/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(config *types.Config, tx dbtx.Transactor, urlProvider...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/system/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- IsUserSignupAllowed
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/system/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(principalStore store.PrincipalStore, config *types.Co...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/template/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/template/create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- sanitizeCreateInput
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/template/delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Delete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/template/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/template/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: validate.go]---
Location: harness-main/app/api/controller/template/validate.go
Signals: N/A
Excerpt (<=80 chars): func parseResolverType(data string) (enum.ResolverType, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseResolverType
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/template/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/app/api/controller/trigger/common.go
Signals: N/A
Excerpt (<=80 chars): func checkSecret(secret string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkSecret
- checkActions
- deduplicateActions
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/trigger/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getRepoCheckPipelineAccess
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/trigger/create.go
Signals: N/A
Excerpt (<=80 chars): type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- sanitizeCreateInput
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/trigger/delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Delete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/trigger/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/trigger/list.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/trigger/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/trigger/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/upload/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- GetMaxFileSize
- getRepoCheckAccess
- getFileExtension
- getFileBucketPath
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/app/api/controller/upload/download.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Download(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Download
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/app/api/controller/upload/upload.go
Signals: N/A
Excerpt (<=80 chars): type Result struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Result
- Upload
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/upload/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/user/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- findUserFromUID
- findUserFromEmail
- isUserTokenType
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/user/create.go
Signals: N/A
Excerpt (<=80 chars): type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- CreateNoAuth
- sanitizeCreateInput
```

--------------------------------------------------------------------------------

---[FILE: create_access_token.go]---
Location: harness-main/app/api/controller/user/create_access_token.go
Signals: N/A
Excerpt (<=80 chars):  type CreateTokenInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTokenInput
- CreateAccessToken
- sanitizeCreateTokenInput
```

--------------------------------------------------------------------------------

---[FILE: create_favorite.go]---
Location: harness-main/app/api/controller/user/create_favorite.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) CreateFavorite(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateFavorite
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/user/delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Delete(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: delete_favorite.go]---
Location: harness-main/app/api/controller/user/delete_favorite.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) DeleteFavorite(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteFavorite
```

--------------------------------------------------------------------------------

---[FILE: delete_token.go]---
Location: harness-main/app/api/controller/user/delete_token.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteToken(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteToken
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/user/find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Find(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
- FindNoAuth
```

--------------------------------------------------------------------------------

---[FILE: find_email.go]---
Location: harness-main/app/api/controller/user/find_email.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FindEmail(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindEmail
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/user/list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) List(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: list_tokens.go]---
Location: harness-main/app/api/controller/user/list_tokens.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListTokens(ctx context.Context, session *auth.Session,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListTokens
```

--------------------------------------------------------------------------------

---[FILE: login.go]---
Location: harness-main/app/api/controller/user/login.go
Signals: N/A
Excerpt (<=80 chars):  type LoginInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginInput
- Login
```

--------------------------------------------------------------------------------

---[FILE: logout.go]---
Location: harness-main/app/api/controller/user/logout.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Logout(ctx context.Context, session *auth.Session) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Logout
```

--------------------------------------------------------------------------------

---[FILE: membership_spaces.go]---
Location: harness-main/app/api/controller/user/membership_spaces.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) MembershipSpaces(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipSpaces
```

--------------------------------------------------------------------------------

---[FILE: publickey_create.go]---
Location: harness-main/app/api/controller/user/publickey_create.go
Signals: N/A
Excerpt (<=80 chars):  type CreatePublicKeyInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatePublicKeyInput
- Sanitize
- CreatePublicKey
- checkKeyExistence
```

--------------------------------------------------------------------------------

---[FILE: publickey_delete.go]---
Location: harness-main/app/api/controller/user/publickey_delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) DeletePublicKey(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePublicKey
```

--------------------------------------------------------------------------------

---[FILE: publickey_edit.go]---
Location: harness-main/app/api/controller/user/publickey_edit.go
Signals: N/A
Excerpt (<=80 chars):  type UpdatePublicKeyInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdatePublicKeyInput
- Sanitize
- UpdatePublicKey
```

--------------------------------------------------------------------------------

---[FILE: publickey_list.go]---
Location: harness-main/app/api/controller/user/publickey_list.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) ListPublicKeys(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPublicKeys
```

--------------------------------------------------------------------------------

---[FILE: register.go]---
Location: harness-main/app/api/controller/user/register.go
Signals: N/A
Excerpt (<=80 chars):  type RegisterInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegisterInput
- Register
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/user/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: update_admin.go]---
Location: harness-main/app/api/controller/user/update_admin.go
Signals: N/A
Excerpt (<=80 chars):  type UpdateAdminInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateAdminInput
- UpdateAdmin
```

--------------------------------------------------------------------------------

````
