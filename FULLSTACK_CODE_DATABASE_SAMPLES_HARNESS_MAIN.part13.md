---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 13
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 13 of 37)

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

---[FILE: 0007_create_table_webhooks.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0007_create_table_webhooks.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE webhooks (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhooks
```

--------------------------------------------------------------------------------

---[FILE: 0009_create_table_webhook_executions.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0009_create_table_webhook_executions.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE webhook_executions (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhook_executions
```

--------------------------------------------------------------------------------

---[FILE: 0011_create_table_pullreq_reviews.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0011_create_table_pullreq_reviews.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_reviews (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_reviews
```

--------------------------------------------------------------------------------

---[FILE: 0013_create_table_pullreq_reviewers.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0013_create_table_pullreq_reviewers.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_reviewers (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_reviewers
```

--------------------------------------------------------------------------------

---[FILE: 0017_create_table_checks.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0017_create_table_checks.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE checks (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checks
- reqchecks
```

--------------------------------------------------------------------------------

---[FILE: 0019_create_table_memberships.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0019_create_table_memberships.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE memberships (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- memberships
```

--------------------------------------------------------------------------------

---[FILE: 0022_create_table_jobs.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0022_create_table_jobs.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE jobs (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jobs
```

--------------------------------------------------------------------------------

---[FILE: 0027_create_ci_tables.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0027_create_ci_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pipelines (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pipelines
- executions
- secrets
- stages
- steps
- logs
- connectors
- templates
- triggers
- plugins
```

--------------------------------------------------------------------------------

---[FILE: 0030_create_table_space_paths.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0030_create_table_space_paths.up.sql
Signals: PostgreSQL
Excerpt (<=80 chars): CREATE TABLE space_paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- space_paths
```

--------------------------------------------------------------------------------

---[FILE: 0032_create_table_pullreq_file_views.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0032_create_table_pullreq_file_views.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_file_views (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_file_views
```

--------------------------------------------------------------------------------

---[FILE: 0036_create_table_rules.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0036_create_table_rules.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE rules (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rules
```

--------------------------------------------------------------------------------

---[FILE: 0040_alter_table_templates_add_type.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0040_alter_table_templates_add_type.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE templates (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- templates
```

--------------------------------------------------------------------------------

---[FILE: 0047_create_table_settings.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0047_create_table_settings.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE settings (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- settings
```

--------------------------------------------------------------------------------

---[FILE: 0050_create_table_public_resources.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0050_create_table_public_resources.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_access_repo (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_access_repo
- public_access_space
```

--------------------------------------------------------------------------------

---[FILE: 0051_create_table_public_key.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0051_create_table_public_key.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_keys (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_keys
```

--------------------------------------------------------------------------------

---[FILE: 0052_create_cde_tables.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0052_create_cde_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE infra_provider_configs

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infra_provider_configs
- infra_provider_templates
- infra_provider_resources
- gitspace_configs
- infra_provisioned
- gitspaces
- gitspace_events
```

--------------------------------------------------------------------------------

---[FILE: 0060_create_table_labels.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0060_create_table_labels.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE labels (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- labels
- label_values
- pullreq_labels
```

--------------------------------------------------------------------------------

---[FILE: 0062_create_cde_delegate_provision_tables.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0062_create_cde_delegate_provision_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE delegate_provision_details

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- delegate_provision_details
```

--------------------------------------------------------------------------------

---[FILE: 0067_create_ar_tables.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0067_create_ar_tables.up.sql
Signals: PostgreSQL
Excerpt (<=80 chars): create table if not exists registries

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- if
- gc_review_after
- gc_track_blob_uploads
```

--------------------------------------------------------------------------------

---[FILE: 0068_create_table_usergroups.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0068_create_table_usergroups.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE usergroups

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usergroups
```

--------------------------------------------------------------------------------

---[FILE: 0069_create_table_usergroup_reviewers.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0069_create_table_usergroup_reviewers.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE usergroup_reviewers (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usergroup_reviewers
```

--------------------------------------------------------------------------------

---[FILE: 0072_create_ar_table_images_and_alter_table_artifacts.down.sql]---
Location: harness-main/app/store/database/migrate/postgres/0072_create_ar_table_images_and_alter_table_artifacts.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE artifacts_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- artifacts_temp
- if
```

--------------------------------------------------------------------------------

---[FILE: 0072_create_ar_table_images_and_alter_table_artifacts.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0072_create_ar_table_images_and_alter_table_artifacts.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE images

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images
- artifacts_temp
```

--------------------------------------------------------------------------------

---[FILE: 0073_create_ar_table_bandwidth_stats_and_download_stats.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0073_create_ar_table_bandwidth_stats_and_download_stats.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE download_stats

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- download_stats
- bandwidth_stats
```

--------------------------------------------------------------------------------

---[FILE: 0074_create_table_connectors.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0074_create_table_connectors.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE connectors (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- connectors
```

--------------------------------------------------------------------------------

---[FILE: 0076_oci_image_index_mapping.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0076_oci_image_index_mapping.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS oci_image_index_mappings

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0091_create_usage_table.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0091_create_usage_table.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE usage_metrics

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usage_metrics
```

--------------------------------------------------------------------------------

---[FILE: 0092_create_ar_file_manager_tables.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0092_create_ar_file_manager_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0096_update_fk_manifest_references_gc.down.sql]---
Location: harness-main/app/store/database/migrate/postgres/0096_update_fk_manifest_references_gc.down.sql
Signals: PostgreSQL
Excerpt (<=80 chars):  CREATE OR REPLACE FUNCTION gc_track_deleted_manifest_lists()

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gc_track_deleted_manifest_lists
```

--------------------------------------------------------------------------------

---[FILE: 0096_update_fk_manifest_references_gc.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0096_update_fk_manifest_references_gc.up.sql
Signals: PostgreSQL
Excerpt (<=80 chars):  CREATE OR REPLACE FUNCTION gc_track_deleted_manifest_lists()

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gc_track_deleted_manifest_lists
```

--------------------------------------------------------------------------------

---[FILE: 0098_create_registry_webhooks_tables.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0098_create_registry_webhooks_tables.up.sql
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
Location: harness-main/app/store/database/migrate/postgres/0103_create_table_lfs_objects.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE lfs_objects (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- lfs_objects
```

--------------------------------------------------------------------------------

---[FILE: 0106_create_ar_package_tag_table.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0106_create_ar_package_tag_table.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- package_tags
```

--------------------------------------------------------------------------------

---[FILE: 0110_create_table_cde_gateways.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0110_create_table_cde_gateways.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS cde_gateways

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0115_create_table_favorite_repos_up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0115_create_table_favorite_repos_up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS favorite_repos

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0116_create_table_branches.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0116_create_table_branches.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE branches (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- branches
```

--------------------------------------------------------------------------------

---[FILE: 0117_create_table_public_key_sub_keys.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0117_create_table_public_key_sub_keys.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_key_sub_keys

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_key_sub_keys
```

--------------------------------------------------------------------------------

---[FILE: 0119_add_task_tracking.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0119_add_task_tracking.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TYPE registry_task_status AS ENUM ('pending', 'processing', 'success',...

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registry_tasks
- registry_task_sources
- registry_task_events
```

--------------------------------------------------------------------------------

---[FILE: 0122_create_table_git_signature_results.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0122_create_table_git_signature_results.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE git_signature_results (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- git_signature_results
```

--------------------------------------------------------------------------------

---[FILE: 0122_create_table_quarantined_paths_and_events.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0122_create_table_quarantined_paths_and_events.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0124_alter_table_quarantined_paths_node_id.down.sql]---
Location: harness-main/app/store/database/migrate/postgres/0124_alter_table_quarantined_paths_node_id.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS quarantined_paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0124_alter_table_quarantined_paths_node_id.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0124_alter_table_quarantined_paths_node_id.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS quarantined_paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0126_create_table_gitspace_settings.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0126_create_table_gitspace_settings.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS gitspace_settings (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0128_replace_gc_track_deleted_layers_function.down.sql]---
Location: harness-main/app/store/database/migrate/postgres/0128_replace_gc_track_deleted_layers_function.down.sql
Signals: PostgreSQL
Excerpt (<=80 chars): CREATE OR REPLACE FUNCTION gc_track_deleted_layers()

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gc_track_deleted_layers
```

--------------------------------------------------------------------------------

---[FILE: 0128_replace_gc_track_deleted_layers_function.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0128_replace_gc_track_deleted_layers_function.up.sql
Signals: PostgreSQL
Excerpt (<=80 chars): CREATE OR REPLACE FUNCTION gc_track_deleted_layers()

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gc_track_deleted_layers
```

--------------------------------------------------------------------------------

---[FILE: 0131_create_table_entity_labels.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0131_create_table_entity_labels.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- entity_labels
```

--------------------------------------------------------------------------------

---[FILE: 0138_create_table_registry_policies.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0138_create_table_registry_policies.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS registry_policies (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

---[FILE: 0144_create_table_public_access_registry.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0144_create_table_public_access_registry.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_access_registry (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_access_registry
```

--------------------------------------------------------------------------------

---[FILE: 0147_create_table_ai_task.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0147_create_table_ai_task.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE ai_tasks (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ai_tasks
```

--------------------------------------------------------------------------------

---[FILE: 0154_create_linked_repositories.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0154_create_linked_repositories.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE linked_repositories (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- linked_repositories
```

--------------------------------------------------------------------------------

---[FILE: 0000_alter_table_migrations.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0000_alter_table_migrations.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE migrations_with_primary_key (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrations_with_primary_key
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_a_principals.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0001_create_table_a_principals.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE principals (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- principals
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_b_spaces.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0001_create_table_b_spaces.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE spaces (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- spaces
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_c_repositories.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0001_create_table_c_repositories.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE repositories (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- repositories
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_d_paths.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0001_create_table_d_paths.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- paths
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_e_tokens.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0001_create_table_e_tokens.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE tokens (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tokens
```

--------------------------------------------------------------------------------

---[FILE: 0003_create_table_pullreqs.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0003_create_table_pullreqs.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreqs (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreqs
```

--------------------------------------------------------------------------------

---[FILE: 0005_create_table_pullreq_activities.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0005_create_table_pullreq_activities.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_activities (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_activities
```

--------------------------------------------------------------------------------

---[FILE: 0007_create_table_webhooks.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0007_create_table_webhooks.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE webhooks (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhooks
```

--------------------------------------------------------------------------------

---[FILE: 0009_create_table_webhook_executions.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0009_create_table_webhook_executions.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE webhook_executions (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhook_executions
```

--------------------------------------------------------------------------------

---[FILE: 0011_create_table_pullreq_reviews.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0011_create_table_pullreq_reviews.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_reviews (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_reviews
```

--------------------------------------------------------------------------------

---[FILE: 0013_create_table_pullreq_reviewers.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0013_create_table_pullreq_reviewers.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_reviewers (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_reviewers
```

--------------------------------------------------------------------------------

---[FILE: 0017_create_table_checks.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0017_create_table_checks.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE checks (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checks
- reqchecks
```

--------------------------------------------------------------------------------

---[FILE: 0019_create_table_memberships.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0019_create_table_memberships.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE memberships (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- memberships
```

--------------------------------------------------------------------------------

---[FILE: 0020_alter_pullreq_source_repo_id_constraint.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0020_alter_pullreq_source_repo_id_constraint.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreqs_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreqs_new
```

--------------------------------------------------------------------------------

---[FILE: 0020_alter_pullreq_source_repo_id_constraint.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0020_alter_pullreq_source_repo_id_constraint.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreqs_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreqs_new
```

--------------------------------------------------------------------------------

---[FILE: 0022_create_table_jobs.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0022_create_table_jobs.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE jobs (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jobs
```

--------------------------------------------------------------------------------

---[FILE: 0027_create_ci_tables.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0027_create_ci_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pipelines (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pipelines
- executions
- secrets
- stages
- steps
- logs
- connectors
- templates
- triggers
- plugins
```

--------------------------------------------------------------------------------

---[FILE: 0030_create_table_space_paths.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0030_create_table_space_paths.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE space_paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- space_paths
```

--------------------------------------------------------------------------------

---[FILE: 0032_create_table_pullreq_file_views.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0032_create_table_pullreq_file_views.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_file_views (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_file_views
```

--------------------------------------------------------------------------------

---[FILE: 0036_create_table_rules.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0036_create_table_rules.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE rules (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rules
```

--------------------------------------------------------------------------------

---[FILE: 0040_alter_table_templates_add_type.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0040_alter_table_templates_add_type.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE templates (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- templates
```

--------------------------------------------------------------------------------

---[FILE: 0044_alter_table_tokens.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0044_alter_table_tokens.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE tokens_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tokens_new
```

--------------------------------------------------------------------------------

---[FILE: 0044_alter_table_tokens.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0044_alter_table_tokens.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE tokens_new (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tokens_new
```

--------------------------------------------------------------------------------

---[FILE: 0047_create_table_settings.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0047_create_table_settings.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE settings (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- settings
```

--------------------------------------------------------------------------------

---[FILE: 0050_create_table_public_resources.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0050_create_table_public_resources.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_access_repo (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_access_repo
- public_access_space
```

--------------------------------------------------------------------------------

---[FILE: 0051_create_table_public_key.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0051_create_table_public_key.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE public_keys (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- public_keys
```

--------------------------------------------------------------------------------

---[FILE: 0052_create_cde_tables.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0052_create_cde_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE infra_provider_configs

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infra_provider_configs
- infra_provider_templates
- infra_provider_resources
- gitspace_configs
- infra_provisioned
- gitspaces
- gitspace_events
```

--------------------------------------------------------------------------------

---[FILE: 0054_alter_cde_tables_change_name_and_indexes.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0054_alter_cde_tables_change_name_and_indexes.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE infra_provider_configs_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infra_provider_configs_temp
- infra_provider_templates_temp
- infra_provider_resources_temp
- gitspace_configs_temp
- gitspaces_temp
```

--------------------------------------------------------------------------------

---[FILE: 0054_alter_cde_tables_change_name_and_indexes.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0054_alter_cde_tables_change_name_and_indexes.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE infra_provider_configs_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infra_provider_configs_temp
- infra_provider_templates_temp
- infra_provider_resources_temp
- gitspace_configs_temp
- gitspaces_temp
```

--------------------------------------------------------------------------------

---[FILE: 0055_alter_cde_tables_events_and_gitspaces.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0055_alter_cde_tables_events_and_gitspaces.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE gitspace_events_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspace_events_temp
- gitspaces_temp
```

--------------------------------------------------------------------------------

---[FILE: 0055_alter_cde_tables_events_and_gitspaces.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0055_alter_cde_tables_events_and_gitspaces.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE gitspace_events_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspace_events_temp
- gitspaces_temp
```

--------------------------------------------------------------------------------

---[FILE: 0059_alter_table_gitspace_events_add_timestamp_rename_uid.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0059_alter_table_gitspace_events_add_timestamp_rename_uid.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE gitspace_events_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspace_events_temp
```

--------------------------------------------------------------------------------

---[FILE: 0059_alter_table_gitspace_events_add_timestamp_rename_uid.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0059_alter_table_gitspace_events_add_timestamp_rename_uid.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE gitspace_events_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspace_events_temp
```

--------------------------------------------------------------------------------

---[FILE: 0060_create_table_labels.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0060_create_table_labels.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE labels (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- labels
- label_values
- pullreq_labels
```

--------------------------------------------------------------------------------

---[FILE: 0062_create_cde_delegate_provision_tables.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0062_create_cde_delegate_provision_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE delegate_provision_details

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- delegate_provision_details
```

--------------------------------------------------------------------------------

---[FILE: 0064_alter_delegate_provision_modify_column.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0064_alter_delegate_provision_modify_column.down.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE delegate_provision_details

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- delegate_provision_details
```

--------------------------------------------------------------------------------

---[FILE: 0064_alter_delegate_provision_modify_column.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0064_alter_delegate_provision_modify_column.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE delegate_provision_details

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- delegate_provision_details
```

--------------------------------------------------------------------------------

---[FILE: 0067_create_ar_tables.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0067_create_ar_tables.up.sql
Signals: N/A
Excerpt (<=80 chars): create table if not exists registries

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- if
```

--------------------------------------------------------------------------------

---[FILE: 0068_create_table_usergroups.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0068_create_table_usergroups.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE usergroups

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usergroups
```

--------------------------------------------------------------------------------

---[FILE: 0069_create_table_usergroup_reviewers.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0069_create_table_usergroup_reviewers.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE usergroup_reviewers (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usergroup_reviewers
```

--------------------------------------------------------------------------------

---[FILE: 0070_drop_index_upstream_proxy_configs.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0070_drop_index_upstream_proxy_configs.down.sql
Signals: N/A
Excerpt (<=80 chars): create table upstream_proxy_configs_dg_tmp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- upstream_proxy_configs_dg_tmp
```

--------------------------------------------------------------------------------

---[FILE: 0070_drop_index_upstream_proxy_configs.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0070_drop_index_upstream_proxy_configs.up.sql
Signals: N/A
Excerpt (<=80 chars): create table upstream_proxy_configs_dg_tmp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- upstream_proxy_configs_dg_tmp
```

--------------------------------------------------------------------------------

---[FILE: 0072_create_ar_table_images_and_alter_table_artifacts.down.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0072_create_ar_table_images_and_alter_table_artifacts.down.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE artifacts_temp

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- artifacts_temp
- if
```

--------------------------------------------------------------------------------

---[FILE: 0072_create_ar_table_images_and_alter_table_artifacts.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0072_create_ar_table_images_and_alter_table_artifacts.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE images

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- images
- artifacts_temp
```

--------------------------------------------------------------------------------

---[FILE: 0073_create_ar_table_bandwidth_stats_and_download_stats.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0073_create_ar_table_bandwidth_stats_and_download_stats.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE download_stats

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- download_stats
- bandwidth_stats
```

--------------------------------------------------------------------------------

---[FILE: 0074_create_table_connectors.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0074_create_table_connectors.up.sql
Signals: N/A
Excerpt (<=80 chars):  CREATE TABLE connectors (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- connectors
```

--------------------------------------------------------------------------------

---[FILE: 0076_oci_image_index_mapping.up.sql]---
Location: harness-main/app/store/database/migrate/sqlite/0076_oci_image_index_mapping.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE IF NOT EXISTS oci_image_index_mappings

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IF
```

--------------------------------------------------------------------------------

````
