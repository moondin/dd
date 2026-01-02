---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 14
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 14 of 37)

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

---[FILE: 0087_create_idx_reg.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0087_create_idx_reg.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE registries_old (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registries_old
```

--------------------------------------------------------------------------------

---[FILE: 0087_create_idx_reg.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0087_create_idx_reg.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE registries_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registries_new
```

--------------------------------------------------------------------------------

---[FILE: 0091_create_usage_table.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0091_create_usage_table.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE usage_metrics

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usage_metrics
```

--------------------------------------------------------------------------------

---[FILE: 0092_create_ar_file_manager_tables.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0092_create_ar_file_manager_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): create table if not exists generic_blobs

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- if
```

--------------------------------------------------------------------------------

---[FILE: 0095_update_foreign_key_manifest_references.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0095_update_foreign_key_manifest_references.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE manifest_references_old

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manifest_references_old
```

--------------------------------------------------------------------------------

---[FILE: 0095_update_foreign_key_manifest_references.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0095_update_foreign_key_manifest_references.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE manifest_references_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manifest_references_new
```

--------------------------------------------------------------------------------

---[FILE: 0097_update_ar_generic_artiface_tables.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0097_update_ar_generic_artiface_tables.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE nodes (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodes
```

--------------------------------------------------------------------------------

---[FILE: 0097_update_ar_generic_artifact_tables.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0097_update_ar_generic_artifact_tables.down.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE nodes (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodes
- artifacts_new
```

--------------------------------------------------------------------------------

---[FILE: 0098_create_registry_webhooks_tables.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0098_create_registry_webhooks_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE registry_webhooks

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registry_webhooks
- registry_webhook_executions
```

--------------------------------------------------------------------------------

---[FILE: 0103_create_table_lfs_objects.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0103_create_table_lfs_objects.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE lfs_objects (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- lfs_objects
```

--------------------------------------------------------------------------------

---[FILE: 0104_alter_table_delegate_provision_details_add_column_task_details.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0104_alter_table_delegate_provision_details_add_column_task_details.down.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE delegate_provision_details

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- delegate_provision_details
```

--------------------------------------------------------------------------------

---[FILE: 0106_create_ar_package_tag_table.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0106_create_ar_package_tag_table.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE package_tags (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- package_tags
```

--------------------------------------------------------------------------------

---[FILE: 0107_alter_table_download_stats.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0107_alter_table_download_stats.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE download_stats_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- download_stats_new
```

--------------------------------------------------------------------------------

---[FILE: 0107_alter_table_download_stats.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0107_alter_table_download_stats.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE download_stats_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- download_stats_new
```

--------------------------------------------------------------------------------

---[FILE: 0108_alter_table_bandwidth_stats.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0108_alter_table_bandwidth_stats.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE bandwidth_stats_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bandwidth_stats_new
```

--------------------------------------------------------------------------------

---[FILE: 0108_alter_table_bandwidth_stats.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0108_alter_table_bandwidth_stats.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE bandwidth_stats_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bandwidth_stats_new
```

--------------------------------------------------------------------------------

---[FILE: 0110_create_table_cde_gateways.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0110_create_table_cde_gateways.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS cde_gateways

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0111_alter_table_nodes.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0111_alter_table_nodes.down.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE nodes (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodes
```

--------------------------------------------------------------------------------

---[FILE: 0111_alter_table_nodes.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0111_alter_table_nodes.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE nodes (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodes
```

--------------------------------------------------------------------------------

---[FILE: 0115_create_table_favorite_repos_up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0115_create_table_favorite_repos_up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS favorite_repos

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0116_create_table_branches.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0116_create_table_branches.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE branches (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- branches
```

--------------------------------------------------------------------------------

---[FILE: 0117_create_table_public_key_sub_keys.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0117_create_table_public_key_sub_keys.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_key_sub_keys

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_key_sub_keys
```

--------------------------------------------------------------------------------

---[FILE: 0119_add_task_tracking.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0119_add_task_tracking.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE registry_tasks (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registry_tasks
- registry_task_sources
- registry_task_events
```

--------------------------------------------------------------------------------

---[FILE: 0122_create_table_git_signature_results.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0122_create_table_git_signature_results.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE git_signature_results (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- git_signature_results
```

--------------------------------------------------------------------------------

---[FILE: 0122_create_table_quarantined_paths_and_events.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0122_create_table_quarantined_paths_and_events.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS quarantined_paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0124_alter_table_quarantined_paths_node_id.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0124_alter_table_quarantined_paths_node_id.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS quarantined_paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0124_alter_table_quarantined_paths_node_id.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0124_alter_table_quarantined_paths_node_id.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS quarantined_paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0126_create_table_gitspace_settings.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0126_create_table_gitspace_settings.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS gitspace_settings (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0129_artifact_image_node_cascade_delete.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0129_artifact_image_node_cascade_delete.down.sql
Signals: N/A
Excerpt (<=80 chars): create table artifacts_dg_tmp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- artifacts_dg_tmp
- images_dg_tmp
- nodes_dg_tmp
```

--------------------------------------------------------------------------------

---[FILE: 0129_artifact_image_node_cascade_delete.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0129_artifact_image_node_cascade_delete.up.sql
Signals: N/A
Excerpt (<=80 chars): create table artifacts_dg_tmp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- artifacts_dg_tmp
- images_dg_tmp
- nodes_dg_tmp
```

--------------------------------------------------------------------------------

---[FILE: 0130_update_ar_tables_registries_images_artifacts_add_uuid.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0130_update_ar_tables_registries_images_artifacts_add_uuid.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE registries_old

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registries_old
- images_old
- artifacts_old
```

--------------------------------------------------------------------------------

---[FILE: 0130_update_ar_tables_registries_images_artifacts_add_uuid.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0130_update_ar_tables_registries_images_artifacts_add_uuid.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE registries_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registries_new
- images_new
- artifacts_new
```

--------------------------------------------------------------------------------

---[FILE: 0131_create_table_entity_labels.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0131_create_table_entity_labels.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE entity_labels (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- entity_labels
```

--------------------------------------------------------------------------------

---[FILE: 0134_create_quarantine_performance_indexes.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0134_create_quarantine_performance_indexes.down.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE quarantined_paths_temp (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- quarantined_paths_temp
```

--------------------------------------------------------------------------------

---[FILE: 0134_create_quarantine_performance_indexes.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0134_create_quarantine_performance_indexes.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE quarantined_paths_temp (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- quarantined_paths_temp
```

--------------------------------------------------------------------------------

---[FILE: 0135_alter_images_add_image_type.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0135_alter_images_add_image_type.down.sql
Signals: N/A
Excerpt (<=80 chars): create table images_old

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images_old
```

--------------------------------------------------------------------------------

---[FILE: 0135_alter_images_add_image_type.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0135_alter_images_add_image_type.up.sql
Signals: N/A
Excerpt (<=80 chars): create table images_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images_new
```

--------------------------------------------------------------------------------

---[FILE: 0136_alter_images_add_unique_indexes.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0136_alter_images_add_unique_indexes.down.sql
Signals: N/A
Excerpt (<=80 chars): create table images_old

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images_old
```

--------------------------------------------------------------------------------

---[FILE: 0136_alter_images_add_unique_indexes.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0136_alter_images_add_unique_indexes.up.sql
Signals: N/A
Excerpt (<=80 chars): create table images_new

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images_new
```

--------------------------------------------------------------------------------

---[FILE: 0137_alter_branch_add_last_created_pullreq.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0137_alter_branch_add_last_created_pullreq.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE branches_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- branches_new
```

--------------------------------------------------------------------------------

---[FILE: 0138_create_table_registry_policies.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0138_create_table_registry_policies.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS registry_policies (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0144_create_table_public_access_registry.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0144_create_table_public_access_registry.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_access_registry (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_access_registry
```

--------------------------------------------------------------------------------

---[FILE: 0146_alter_pullreq_source_repo_id_nullable.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0146_alter_pullreq_source_repo_id_nullable.down.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE pullreqs_tmp(

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreqs_tmp
```

--------------------------------------------------------------------------------

---[FILE: 0146_alter_pullreq_source_repo_id_nullable.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0146_alter_pullreq_source_repo_id_nullable.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE pullreqs_tmp(

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreqs_tmp
```

--------------------------------------------------------------------------------

---[FILE: 0147_create_table_ai_task.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0147_create_table_ai_task.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE ai_tasks (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ai_tasks
```

--------------------------------------------------------------------------------

---[FILE: 0149_alter_table_images_add_node_id.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0149_alter_table_images_add_node_id.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE images_original (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images_original
```

--------------------------------------------------------------------------------

---[FILE: 0149_alter_table_images_add_node_id.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0149_alter_table_images_add_node_id.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE images_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images_new
```

--------------------------------------------------------------------------------

---[FILE: 0150_alter_table_artifacts_add_node_id.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0150_alter_table_artifacts_add_node_id.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE artifacts_original (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- artifacts_original
```

--------------------------------------------------------------------------------

---[FILE: 0150_alter_table_artifacts_add_node_id.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0150_alter_table_artifacts_add_node_id.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE artifacts_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- artifacts_new
```

--------------------------------------------------------------------------------

---[FILE: 0154_create_linked_repositories.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0154_create_linked_repositories.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE linked_repositories (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- linked_repositories
```

--------------------------------------------------------------------------------

---[FILE: mutex.go]---
Location: harness-main/app/store/database/mutex/mutex.go
Signals: N/A
Excerpt (<=80 chars): func RLock() { m.RLock() }

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RLock
- RUnlock
- Lock
- Unlock
```

--------------------------------------------------------------------------------

---[FILE: combine.go]---
Location: harness-main/app/store/logs/combine.go
Signals: N/A
Excerpt (<=80 chars): func NewCombined(primary, secondary store.LogStore) store.LogStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- combined
- NewCombined
- Find
- Create
- Update
- Delete
```

--------------------------------------------------------------------------------

---[FILE: db.go]---
Location: harness-main/app/store/logs/db.go
Signals: N/A
Excerpt (<=80 chars): type logs struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- logs
- logStore
- NewDatabaseLogStore
- Find
- Create
- Update
- Delete
```

--------------------------------------------------------------------------------

---[FILE: s3.go]---
Location: harness-main/app/store/logs/s3.go
Signals: N/A
Excerpt (<=80 chars): func NewS3LogStore(bucket, prefix, endpoint string, pathStyle bool) store.Log...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- s3store
- NewS3LogStore
- Find
- Create
- Update
- Delete
- key
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/store/logs/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideLogStore(db *sqlx.DB, config *types.Config) store.LogStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideLogStore
```

--------------------------------------------------------------------------------

---[FILE: token.go]---
Location: harness-main/app/token/token.go
Signals: N/A
Excerpt (<=80 chars):  func CreateUserWithAccessPermissions(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateUserWithAccessPermissions
- CreateUserSession
- CreatePAT
- CreateSAT
- CreateRemoteAuthToken
- GenerateIdentifier
- create
- createWithAccessPermissions
```

--------------------------------------------------------------------------------

---[FILE: provider.go]---
Location: harness-main/app/url/provider.go
Signals: N/A
Excerpt (<=80 chars): type Provider interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Provider
- NewProvider
- GetInternalAPIURL
- GenerateContainerGITCloneURL
- GenerateGITCloneURL
- GenerateGITCloneSSHURL
- GenerateUIBuildURL
- GenerateUIRepoURL
- GenerateUIPRURL
- GenerateUICompareURL
- GenerateUIRefURL
- GetAPIHostname
- GetGITHostname
- GetAPIProto
- RegistryURL
- PackageURL
- GetUIBaseURL
```

--------------------------------------------------------------------------------

---[FILE: provider_test.go]---
Location: harness-main/app/url/provider_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestBuildGITCloneSSHURL(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestBuildGITCloneSSHURL
- TestNewProvider
- TestProvider_GetInternalAPIURL
- TestProvider_GenerateContainerGITCloneURL
- TestProvider_GenerateGITCloneURL
- TestProvider_GenerateGITCloneSSHURL
- TestProvider_GenerateUIRepoURL
- TestProvider_GenerateUIPRURL
- TestProvider_GenerateUICompareURL
- TestProvider_GenerateUIRefURL
- TestProvider_GetAPIHostname
- TestProvider_GetGITHostname
- TestProvider_GetAPIProto
- TestProvider_GetUIBaseURL
- TestProvider_GenerateUIBuildURL
- TestProvider_RegistryURL
- TestProvider_PackageURL
- TestProvider_GenerateUIRegistryURL
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/url/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideURLProvider(config *types.Config) (Provider, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideURLProvider
```

--------------------------------------------------------------------------------

---[FILE: audit.go]---
Location: harness-main/audit/audit.go
Signals: N/A
Excerpt (<=80 chars):  type Action string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resource
- DiffObject
- Event
- Noop
- Option
- Validate
- NewResource
- DataAsSlice
- New
- Log
- Apply
- WithID
- WithNewObject
- WithOldObject
- WithClientIP
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/audit/context.go
Signals: N/A
Excerpt (<=80 chars):  type key int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRealIP
- GetPath
- GetRequestID
- GetRequestMethod
```

--------------------------------------------------------------------------------

---[FILE: context_test.go]---
Location: harness-main/audit/context_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetRealIP(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetRealIP
- TestGetPath
- TestGetRequestID
- TestGetRequestMethod
```

--------------------------------------------------------------------------------

---[FILE: middleware.go]---
Location: harness-main/audit/middleware.go
Signals: N/A
Excerpt (<=80 chars): func Middleware() func(next http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Middleware
- RealIP
```

--------------------------------------------------------------------------------

---[FILE: objects.go]---
Location: harness-main/audit/objects.go
Signals: N/A
Excerpt (<=80 chars): type RepositoryObject struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryObject
- RegistryObject
- PullRequestObject
- CommitObject
- CommitTagObject
- BranchObject
- RegistryUpstreamProxyConfigObject
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/audit/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideAuditService() Service {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideAuditService
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/blob/config.go
Signals: N/A
Excerpt (<=80 chars):  type Provider string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: config_test.go]---
Location: harness-main/blob/config_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestProviderConstants(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestProviderConstants
- TestConfigStruct
- TestProviderStringConversion
- TestProviderComparison
```

--------------------------------------------------------------------------------

---[FILE: filesystem.go]---
Location: harness-main/blob/filesystem.go
Signals: N/A
Excerpt (<=80 chars):  type FileSystemStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileSystemStore
- NewFileSystemStore
- Upload
- GetSignedURL
- Download
```

--------------------------------------------------------------------------------

---[FILE: filesystem_test.go]---
Location: harness-main/blob/filesystem_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNewFileSystemStore(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNewFileSystemStore
- TestFileSystemStore_Upload
- TestFileSystemStore_Upload_DirectoryCreation
- TestFileSystemStore_Download
- TestFileSystemStore_GetSignedURL
- TestFileSystemStore_GetSignedURL_WithOptions
- TestFileSystemStore_Upload_ErrorCases
- TestFileSystemStore_Interface
```

--------------------------------------------------------------------------------

---[FILE: gcs.go]---
Location: harness-main/blob/gcs.go
Signals: N/A
Excerpt (<=80 chars):  type GCSStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GCSStore
- NewGCSStore
- Upload
- GetSignedURL
- Download
- createNewImpersonatedClient
- getClient
- checkAndRefreshToken
```

--------------------------------------------------------------------------------

---[FILE: gcs_test.go]---
Location: harness-main/blob/gcs_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNewGCSStore_InvalidConfig(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNewGCSStore_InvalidConfig
- TestGCSStore_ConfigValidation
- TestGCSStore_Interface
- TestGCSStore_DefaultScope
```

--------------------------------------------------------------------------------

---[FILE: interface.go]---
Location: harness-main/blob/interface.go
Signals: N/A
Excerpt (<=80 chars):  type Store interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Store
```

--------------------------------------------------------------------------------

---[FILE: interface_test.go]---
Location: harness-main/blob/interface_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestErrors(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestErrors
- TestErrorsAreDistinct
- TestErrorsCanBeWrapped
```

--------------------------------------------------------------------------------

---[FILE: options.go]---
Location: harness-main/blob/options.go
Signals: N/A
Excerpt (<=80 chars):  type SignURLConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SignURLConfig
- SignURLOption
- Apply
- SignWithMethod
- SignWithContentType
- SignWithHeaders
- SignWithQueryParameters
- SignWithInsecure
```

--------------------------------------------------------------------------------

---[FILE: options_test.go]---
Location: harness-main/blob/options_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestSignURLConfig(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestSignURLConfig
- TestSignWithMethod
- TestSignWithContentType
- TestSignWithHeaders
- TestSignWithQueryParameters
- TestSignWithInsecure
- TestSignedURLConfigFunc
- TestMultipleOptions
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/blob/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideStore(ctx context.Context, config Config) (Store, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideStore
```

--------------------------------------------------------------------------------

---[FILE: cache_test.go]---
Location: harness-main/cache/cache_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestDeduplicate(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDeduplicate
```

--------------------------------------------------------------------------------

---[FILE: no_cache.go]---
Location: harness-main/cache/no_cache.go
Signals: N/A
Excerpt (<=80 chars):  type NoCache[K any, V any] struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Stats
- Get
- Evict
```

--------------------------------------------------------------------------------

---[FILE: no_cache_test.go]---
Location: harness-main/cache/no_cache_test.go
Signals: N/A
Excerpt (<=80 chars):  type contextKey string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockGetter
- Find
- TestNewNoCache
- TestNoCache_Stats
- TestNoCache_Get
- TestNoCache_Evict
```

--------------------------------------------------------------------------------

---[FILE: redis_cache.go]---
Location: harness-main/cache/redis_cache.go
Signals: N/A
Excerpt (<=80 chars):  type LogErrFn func(context.Context, error)

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Stats
- Get
- Evict
```

--------------------------------------------------------------------------------

---[FILE: ttl_cache.go]---
Location: harness-main/cache/ttl_cache.go
Signals: N/A
Excerpt (<=80 chars): type TTLCache[K comparable, V any] struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- purger
- Stop
- Stats
- Evict
- EvictAll
- fetch
- Map
- Get
```

--------------------------------------------------------------------------------

---[FILE: cli.go]---
Location: harness-main/cli/cli.go
Signals: N/A
Excerpt (<=80 chars):  func GetArguments() []string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArguments
```

--------------------------------------------------------------------------------

---[FILE: cli_test.go]---
Location: harness-main/cli/cli_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetArguments(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetArguments
- TestGetArguments_PreservesOrder
- TestGetArguments_ReturnsSlice
- TestGetArguments_EmptyArgs
```

--------------------------------------------------------------------------------

---[FILE: login.go]---
Location: harness-main/cli/operations/account/login.go
Signals: N/A
Excerpt (<=80 chars):  type loginCommand struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loginCommand
- run
- RegisterLogin
```

--------------------------------------------------------------------------------

---[FILE: logout.go]---
Location: harness-main/cli/operations/account/logout.go
Signals: N/A
Excerpt (<=80 chars):  type logoutCommand struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- logoutCommand
- run
- RegisterLogout
```

--------------------------------------------------------------------------------

---[FILE: register.go]---
Location: harness-main/cli/operations/account/register.go
Signals: N/A
Excerpt (<=80 chars):  type Session interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Session
- registerCommand
- run
- RegisterRegister
```

--------------------------------------------------------------------------------

---[FILE: hooks.go]---
Location: harness-main/cli/operations/hooks/hooks.go
Signals: N/A
Excerpt (<=80 chars):  func Register(app *kingpin.Application) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Register
```

--------------------------------------------------------------------------------

---[FILE: current.go]---
Location: harness-main/cli/operations/migrate/current.go
Signals: N/A
Excerpt (<=80 chars):  type commandCurrent struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commandCurrent
- run
- registerCurrent
```

--------------------------------------------------------------------------------

---[FILE: migrate.go]---
Location: harness-main/cli/operations/migrate/migrate.go
Signals: N/A
Excerpt (<=80 chars): func Register(app *kingpin.Application) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Register
- getDB
- setupLoggingContext
```

--------------------------------------------------------------------------------

---[FILE: to.go]---
Location: harness-main/cli/operations/migrate/to.go
Signals: N/A
Excerpt (<=80 chars):  type commandTo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commandTo
- run
- registerTo
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/cli/operations/server/config.go
Signals: N/A
Excerpt (<=80 chars): func LoadConfig() (*types.Config, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadConfig
- backfillURLs
- combineToRawURL
- getSanitizedMachineName
- ProvideDatabaseConfig
- ProvideBlobStoreConfig
- ProvideGitConfig
- ProvideEventsConfig
- ProvideWebhookConfig
- ProvideNotificationConfig
- ProvideTriggerConfig
- ProvideBranchConfig
- ProvideLockConfig
- ProvidePubsubConfig
- ProvideCleanupConfig
- ProvideCodeOwnerConfig
- ProvideKeywordSearchConfig
- ProvideJobsConfig
```

--------------------------------------------------------------------------------

---[FILE: config_test.go]---
Location: harness-main/cli/operations/server/config_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestBackfillURLsHTTPEmptyPort(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestBackfillURLsHTTPEmptyPort
- TestBackfillURLsSSHEmptyPort
- TestBackfillURLsHTTPHostPort
- TestBackfillURLsSSHHostPort
- TestBackfillURLsHTTPPortStripsDefaultHTTP
- TestBackfillURLsHTTPPortStripsDefaultHTTPS
- TestBackfillURLsSSHPortStripsDefault
- TestBackfillURLsBaseInvalidProtocol
- TestBackfillURLsBaseNoHost
- TestBackfillURLsBaseNoHostWithPort
- TestBackfillURLsBaseInvalidPort
- TestBackfillURLsBase
- TestBackfillURLsBaseDefaultPortHTTP
- TestBackfillURLsBaseDefaultPortHTTPExplicit
- TestBackfillURLsBaseDefaultPortHTTPS
- TestBackfillURLsBaseDefaultPortHTTPSExplicit
- TestBackfillURLsBaseRootPathStripped
- TestBackfillURLsSSHBasePathIgnored
```

--------------------------------------------------------------------------------

---[FILE: redis.go]---
Location: harness-main/cli/operations/server/redis.go
Signals: N/A
Excerpt (<=80 chars): func ProvideRedis(config *types.Config) (redis.UniversalClient, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideRedis
```

--------------------------------------------------------------------------------

---[FILE: server.go]---
Location: harness-main/cli/operations/server/server.go
Signals: N/A
Excerpt (<=80 chars):  type command struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- command
- run
- SetupLogger
- SetupProfiler
- Register
```

--------------------------------------------------------------------------------

---[FILE: system.go]---
Location: harness-main/cli/operations/server/system.go
Signals: N/A
Excerpt (<=80 chars): type System struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- System
- NewSystem
```

--------------------------------------------------------------------------------

---[FILE: swagger.go]---
Location: harness-main/cli/operations/swagger/swagger.go
Signals: N/A
Excerpt (<=80 chars):  type command struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- command
- run
- Register
```

--------------------------------------------------------------------------------

---[FILE: create_pat.go]---
Location: harness-main/cli/operations/user/create_pat.go
Signals: N/A
Excerpt (<=80 chars):  type createPATCommand struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createPATCommand
- run
- registerCreatePAT
```

--------------------------------------------------------------------------------

---[FILE: self.go]---
Location: harness-main/cli/operations/user/self.go
Signals: N/A
Excerpt (<=80 chars):  type command struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- command
- run
- registerSelf
```

--------------------------------------------------------------------------------

---[FILE: users.go]---
Location: harness-main/cli/operations/user/users.go
Signals: N/A
Excerpt (<=80 chars): func Register(app *kingpin.Application) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Register
```

--------------------------------------------------------------------------------

````
