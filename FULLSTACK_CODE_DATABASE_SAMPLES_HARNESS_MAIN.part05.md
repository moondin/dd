---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 5
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 5 of 37)

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

---[FILE: reviewer_list.go]---
Location: harness-main/app/api/handler/pullreq/reviewer_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleReviewerList(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleReviewerList
```

--------------------------------------------------------------------------------

---[FILE: review_submit.go]---
Location: harness-main/app/api/handler/pullreq/review_submit.go
Signals: N/A
Excerpt (<=80 chars): func HandleReviewSubmit(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleReviewSubmit
```

--------------------------------------------------------------------------------

---[FILE: usergroup_reviewer_add.go]---
Location: harness-main/app/api/handler/pullreq/usergroup_reviewer_add.go
Signals: N/A
Excerpt (<=80 chars): func HandleUserGroupReviewerAdd(pullreqCtrl *pullreq.Controller) http.Handler...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUserGroupReviewerAdd
```

--------------------------------------------------------------------------------

---[FILE: usergroup_reviewer_delete.go]---
Location: harness-main/app/api/handler/pullreq/usergroup_reviewer_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleUserGroupReviewerDelete(pullreqCtrl *pullreq.Controller) http.Hand...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUserGroupReviewerDelete
```

--------------------------------------------------------------------------------

---[FILE: archive.go]---
Location: harness-main/app/api/handler/repo/archive.go
Signals: N/A
Excerpt (<=80 chars):  func HandleArchive(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleArchive
```

--------------------------------------------------------------------------------

---[FILE: blame.go]---
Location: harness-main/app/api/handler/repo/blame.go
Signals: N/A
Excerpt (<=80 chars): func HandleBlame(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleBlame
```

--------------------------------------------------------------------------------

---[FILE: calculate_commit_divergence.go]---
Location: harness-main/app/api/handler/repo/calculate_commit_divergence.go
Signals: N/A
Excerpt (<=80 chars): func HandleCalculateCommitDivergence(repoCtrl *repo.Controller) http.HandlerF...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCalculateCommitDivergence
```

--------------------------------------------------------------------------------

---[FILE: codeowner_validate.go]---
Location: harness-main/app/api/handler/repo/codeowner_validate.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCodeOwnersValidate(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCodeOwnersValidate
```

--------------------------------------------------------------------------------

---[FILE: commit.go]---
Location: harness-main/app/api/handler/repo/commit.go
Signals: N/A
Excerpt (<=80 chars): func HandleCommitFiles(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCommitFiles
```

--------------------------------------------------------------------------------

---[FILE: content_get.go]---
Location: harness-main/app/api/handler/repo/content_get.go
Signals: N/A
Excerpt (<=80 chars): func HandleGetContent(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGetContent
```

--------------------------------------------------------------------------------

---[FILE: content_paths_details.go]---
Location: harness-main/app/api/handler/repo/content_paths_details.go
Signals: N/A
Excerpt (<=80 chars): func HandlePathsDetails(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePathsDetails
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/repo/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: create_branch.go]---
Location: harness-main/app/api/handler/repo/create_branch.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateBranch(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateBranch
```

--------------------------------------------------------------------------------

---[FILE: create_commit_tag.go]---
Location: harness-main/app/api/handler/repo/create_commit_tag.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCreateCommitTag(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateCommitTag
```

--------------------------------------------------------------------------------

---[FILE: create_fork.go]---
Location: harness-main/app/api/handler/repo/create_fork.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCreateFork(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateFork
```

--------------------------------------------------------------------------------

---[FILE: default_branch.go]---
Location: harness-main/app/api/handler/repo/default_branch.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdateDefaultBranch(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateDefaultBranch
```

--------------------------------------------------------------------------------

---[FILE: delete_branch.go]---
Location: harness-main/app/api/handler/repo/delete_branch.go
Signals: N/A
Excerpt (<=80 chars): func HandleDeleteBranch(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteBranch
```

--------------------------------------------------------------------------------

---[FILE: delete_commit_tag.go]---
Location: harness-main/app/api/handler/repo/delete_commit_tag.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDeleteCommitTag(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteCommitTag
```

--------------------------------------------------------------------------------

---[FILE: diff.go]---
Location: harness-main/app/api/handler/repo/diff.go
Signals: N/A
Excerpt (<=80 chars): func HandleDiff(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDiff
- HandleCommitDiff
- HandleDiffStats
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/repo/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: find_redirect.go]---
Location: harness-main/app/api/handler/repo/find_redirect.go
Signals: N/A
Excerpt (<=80 chars): func HandleGitRedirect(urlProvider url.Provider) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGitRedirect
```

--------------------------------------------------------------------------------

---[FILE: fork_sync.go]---
Location: harness-main/app/api/handler/repo/fork_sync.go
Signals: N/A
Excerpt (<=80 chars):  func HandleForkSync(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleForkSync
```

--------------------------------------------------------------------------------

---[FILE: get_branch.go]---
Location: harness-main/app/api/handler/repo/get_branch.go
Signals: N/A
Excerpt (<=80 chars): func HandleGetBranch(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGetBranch
```

--------------------------------------------------------------------------------

---[FILE: get_commit.go]---
Location: harness-main/app/api/handler/repo/get_commit.go
Signals: N/A
Excerpt (<=80 chars): func HandleGetCommit(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGetCommit
```

--------------------------------------------------------------------------------

---[FILE: git_info_refs.go]---
Location: harness-main/app/api/handler/repo/git_info_refs.go
Signals: N/A
Excerpt (<=80 chars): func HandleGitInfoRefs(repoCtrl *repo.Controller, urlProvider url.Provider) h...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGitInfoRefs
- pktError
```

--------------------------------------------------------------------------------

---[FILE: git_service_pack.go]---
Location: harness-main/app/api/handler/repo/git_service_pack.go
Signals: N/A
Excerpt (<=80 chars): func HandleGitServicePack(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGitServicePack
```

--------------------------------------------------------------------------------

---[FILE: import.go]---
Location: harness-main/app/api/handler/repo/import.go
Signals: N/A
Excerpt (<=80 chars):  func HandleImport(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleImport
```

--------------------------------------------------------------------------------

---[FILE: import_progress.go]---
Location: harness-main/app/api/handler/repo/import_progress.go
Signals: N/A
Excerpt (<=80 chars):  func HandleImportProgress(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleImportProgress
```

--------------------------------------------------------------------------------

---[FILE: label_define.go]---
Location: harness-main/app/api/handler/repo/label_define.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDefineLabel(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDefineLabel
```

--------------------------------------------------------------------------------

---[FILE: label_delete.go]---
Location: harness-main/app/api/handler/repo/label_delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDeleteLabel(labelCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteLabel
```

--------------------------------------------------------------------------------

---[FILE: label_find.go]---
Location: harness-main/app/api/handler/repo/label_find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFindLabel(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFindLabel
```

--------------------------------------------------------------------------------

---[FILE: label_list.go]---
Location: harness-main/app/api/handler/repo/label_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListLabels(labelCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListLabels
```

--------------------------------------------------------------------------------

---[FILE: label_save.go]---
Location: harness-main/app/api/handler/repo/label_save.go
Signals: N/A
Excerpt (<=80 chars):  func HandleSaveLabel(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSaveLabel
```

--------------------------------------------------------------------------------

---[FILE: label_update.go]---
Location: harness-main/app/api/handler/repo/label_update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdateLabel(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateLabel
```

--------------------------------------------------------------------------------

---[FILE: label_value_define.go]---
Location: harness-main/app/api/handler/repo/label_value_define.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDefineLabelValue(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDefineLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_delete.go]---
Location: harness-main/app/api/handler/repo/label_value_delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDeleteLabelValue(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_list.go]---
Location: harness-main/app/api/handler/repo/label_value_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListLabelValues(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListLabelValues
```

--------------------------------------------------------------------------------

---[FILE: label_value_update.go]---
Location: harness-main/app/api/handler/repo/label_value_update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdateLabelValue(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateLabelValue
```

--------------------------------------------------------------------------------

---[FILE: linked_create.go]---
Location: harness-main/app/api/handler/repo/linked_create.go
Signals: N/A
Excerpt (<=80 chars):  func HandleLinkedCreate(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLinkedCreate
```

--------------------------------------------------------------------------------

---[FILE: linked_sync.go]---
Location: harness-main/app/api/handler/repo/linked_sync.go
Signals: N/A
Excerpt (<=80 chars):  func HandleLinkedSync(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLinkedSync
```

--------------------------------------------------------------------------------

---[FILE: list_branches.go]---
Location: harness-main/app/api/handler/repo/list_branches.go
Signals: N/A
Excerpt (<=80 chars): func HandleListBranches(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListBranches
```

--------------------------------------------------------------------------------

---[FILE: list_commits.go]---
Location: harness-main/app/api/handler/repo/list_commits.go
Signals: N/A
Excerpt (<=80 chars): func HandleListCommits(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListCommits
```

--------------------------------------------------------------------------------

---[FILE: list_commit_tags.go]---
Location: harness-main/app/api/handler/repo/list_commit_tags.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListCommitTags(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListCommitTags
```

--------------------------------------------------------------------------------

---[FILE: list_paths.go]---
Location: harness-main/app/api/handler/repo/list_paths.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListPaths(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListPaths
```

--------------------------------------------------------------------------------

---[FILE: list_pipelines.go]---
Location: harness-main/app/api/handler/repo/list_pipelines.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListPipelines(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListPipelines
```

--------------------------------------------------------------------------------

---[FILE: list_service_accounts.go]---
Location: harness-main/app/api/handler/repo/list_service_accounts.go
Signals: N/A
Excerpt (<=80 chars): func HandleListServiceAccounts(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListServiceAccounts
```

--------------------------------------------------------------------------------

---[FILE: merge_check.go]---
Location: harness-main/app/api/handler/repo/merge_check.go
Signals: N/A
Excerpt (<=80 chars): func HandleMergeCheck(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMergeCheck
```

--------------------------------------------------------------------------------

---[FILE: move.go]---
Location: harness-main/app/api/handler/repo/move.go
Signals: N/A
Excerpt (<=80 chars): func HandleMove(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMove
```

--------------------------------------------------------------------------------

---[FILE: pipeline_generate.go]---
Location: harness-main/app/api/handler/repo/pipeline_generate.go
Signals: N/A
Excerpt (<=80 chars):  func HandlePipelineGenerate(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePipelineGenerate
```

--------------------------------------------------------------------------------

---[FILE: purge.go]---
Location: harness-main/app/api/handler/repo/purge.go
Signals: N/A
Excerpt (<=80 chars):  func HandlePurge(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePurge
```

--------------------------------------------------------------------------------

---[FILE: raw.go]---
Location: harness-main/app/api/handler/repo/raw.go
Signals: N/A
Excerpt (<=80 chars): func HandleRaw(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRaw
- detectContentType
```

--------------------------------------------------------------------------------

---[FILE: rebase.go]---
Location: harness-main/app/api/handler/repo/rebase.go
Signals: N/A
Excerpt (<=80 chars):  func HandleRebase(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRebase
```

--------------------------------------------------------------------------------

---[FILE: restore.go]---
Location: harness-main/app/api/handler/repo/restore.go
Signals: N/A
Excerpt (<=80 chars):  func HandleRestore(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRestore
```

--------------------------------------------------------------------------------

---[FILE: rule_create.go]---
Location: harness-main/app/api/handler/repo/rule_create.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleCreate(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleCreate
```

--------------------------------------------------------------------------------

---[FILE: rule_delete.go]---
Location: harness-main/app/api/handler/repo/rule_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleDelete(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleDelete
```

--------------------------------------------------------------------------------

---[FILE: rule_find.go]---
Location: harness-main/app/api/handler/repo/rule_find.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleFind(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleFind
```

--------------------------------------------------------------------------------

---[FILE: rule_list.go]---
Location: harness-main/app/api/handler/repo/rule_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleList(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleList
```

--------------------------------------------------------------------------------

---[FILE: rule_update.go]---
Location: harness-main/app/api/handler/repo/rule_update.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleUpdate(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleUpdate
```

--------------------------------------------------------------------------------

---[FILE: soft_delete.go]---
Location: harness-main/app/api/handler/repo/soft_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleSoftDelete(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSoftDelete
```

--------------------------------------------------------------------------------

---[FILE: squash.go]---
Location: harness-main/app/api/handler/repo/squash.go
Signals: N/A
Excerpt (<=80 chars):  func HandleSquash(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSquash
```

--------------------------------------------------------------------------------

---[FILE: summary.go]---
Location: harness-main/app/api/handler/repo/summary.go
Signals: N/A
Excerpt (<=80 chars): func HandleSummary(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSummary
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/repo/update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdate(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: update_public_access.go]---
Location: harness-main/app/api/handler/repo/update_public_access.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdatePublicAccess(repoCtrl *repo.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdatePublicAccess
```

--------------------------------------------------------------------------------

---[FILE: general_find.go]---
Location: harness-main/app/api/handler/reposettings/general_find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleGeneralFind(repoSettingCtrl *reposettings.Controller) http.Handle...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGeneralFind
```

--------------------------------------------------------------------------------

---[FILE: general_update.go]---
Location: harness-main/app/api/handler/reposettings/general_update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleGeneralUpdate(repoSettingCtrl *reposettings.Controller) http.Hand...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGeneralUpdate
```

--------------------------------------------------------------------------------

---[FILE: security_find.go]---
Location: harness-main/app/api/handler/reposettings/security_find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleSecurityFind(repoSettingCtrl *reposettings.Controller) http.Handl...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSecurityFind
```

--------------------------------------------------------------------------------

---[FILE: security_update.go]---
Location: harness-main/app/api/handler/reposettings/security_update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleSecurityUpdate(repoSettingCtrl *reposettings.Controller) http.Han...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSecurityUpdate
```

--------------------------------------------------------------------------------

---[FILE: resource.go]---
Location: harness-main/app/api/handler/resource/resource.go
Signals: N/A
Excerpt (<=80 chars):  func HandleGitIgnores() http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleGitIgnores
- HandleLicences
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/secret/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(secretCtrl *secret.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/secret/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDelete(secretCtrl *secret.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/secret/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(secretCtrl *secret.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/secret/update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdate(secretCtrl *secret.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/serviceaccount/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(saCtrl *serviceaccount.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: create_token.go]---
Location: harness-main/app/api/handler/serviceaccount/create_token.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateToken(saCrl *serviceaccount.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateToken
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/serviceaccount/delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleDelete(saCrl *serviceaccount.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: delete_token.go]---
Location: harness-main/app/api/handler/serviceaccount/delete_token.go
Signals: N/A
Excerpt (<=80 chars): func HandleDeleteToken(saCrl *serviceaccount.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteToken
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/serviceaccount/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(saCrl *serviceaccount.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: list_tokens.go]---
Location: harness-main/app/api/handler/serviceaccount/list_tokens.go
Signals: N/A
Excerpt (<=80 chars): func HandleListTokens(saCrl *serviceaccount.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListTokens
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/space/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/api/handler/space/events.go
Signals: N/A
Excerpt (<=80 chars): func HandleEvents(appCtx context.Context, spaceCtrl *space.Controller) http.H...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleEvents
```

--------------------------------------------------------------------------------

---[FILE: export.go]---
Location: harness-main/app/api/handler/space/export.go
Signals: N/A
Excerpt (<=80 chars):  func HandleExport(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleExport
```

--------------------------------------------------------------------------------

---[FILE: export_progress.go]---
Location: harness-main/app/api/handler/space/export_progress.go
Signals: N/A
Excerpt (<=80 chars):  func HandleExportProgress(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleExportProgress
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/space/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: import.go]---
Location: harness-main/app/api/handler/space/import.go
Signals: N/A
Excerpt (<=80 chars):  func HandleImport(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleImport
```

--------------------------------------------------------------------------------

---[FILE: import_repositories.go]---
Location: harness-main/app/api/handler/space/import_repositories.go
Signals: N/A
Excerpt (<=80 chars):  func HandleImportRepositories(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleImportRepositories
```

--------------------------------------------------------------------------------

---[FILE: label_define.go]---
Location: harness-main/app/api/handler/space/label_define.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDefineLabel(labelCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDefineLabel
```

--------------------------------------------------------------------------------

---[FILE: label_delete.go]---
Location: harness-main/app/api/handler/space/label_delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDeleteLabel(labelCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteLabel
```

--------------------------------------------------------------------------------

---[FILE: label_find.go]---
Location: harness-main/app/api/handler/space/label_find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFindLabel(labelCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFindLabel
```

--------------------------------------------------------------------------------

---[FILE: label_list.go]---
Location: harness-main/app/api/handler/space/label_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListLabels(labelCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListLabels
```

--------------------------------------------------------------------------------

---[FILE: label_save.go]---
Location: harness-main/app/api/handler/space/label_save.go
Signals: N/A
Excerpt (<=80 chars):  func HandleSaveLabel(labelCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSaveLabel
```

--------------------------------------------------------------------------------

---[FILE: label_update.go]---
Location: harness-main/app/api/handler/space/label_update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdateLabel(labelCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateLabel
```

--------------------------------------------------------------------------------

---[FILE: label_value_define.go]---
Location: harness-main/app/api/handler/space/label_value_define.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDefineLabelValue(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDefineLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_delete.go]---
Location: harness-main/app/api/handler/space/label_value_delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDeleteLabelValue(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_list.go]---
Location: harness-main/app/api/handler/space/label_value_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListLabelValues(labelValueCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListLabelValues
```

--------------------------------------------------------------------------------

---[FILE: label_value_update.go]---
Location: harness-main/app/api/handler/space/label_value_update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdateLabelValue(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateLabelValue
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/handler/space/list.go
Signals: N/A
Excerpt (<=80 chars): func HandleListSpaces(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListSpaces
```

--------------------------------------------------------------------------------

---[FILE: list_connectors.go]---
Location: harness-main/app/api/handler/space/list_connectors.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListConnectors(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListConnectors
```

--------------------------------------------------------------------------------

---[FILE: list_executions.go]---
Location: harness-main/app/api/handler/space/list_executions.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListExecutions(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListExecutions
```

--------------------------------------------------------------------------------

---[FILE: list_gitspaces.go]---
Location: harness-main/app/api/handler/space/list_gitspaces.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListGitspaces(spacesCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListGitspaces
```

--------------------------------------------------------------------------------

---[FILE: list_infraproviders.go]---
Location: harness-main/app/api/handler/space/list_infraproviders.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListInfraProviderConfigs(infraProviderCtrl *infraprovider.Control...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListInfraProviderConfigs
```

--------------------------------------------------------------------------------

---[FILE: list_pipelines.go]---
Location: harness-main/app/api/handler/space/list_pipelines.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListPipelines(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListPipelines
```

--------------------------------------------------------------------------------

---[FILE: list_repos.go]---
Location: harness-main/app/api/handler/space/list_repos.go
Signals: N/A
Excerpt (<=80 chars): func HandleListRepos(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListRepos
```

--------------------------------------------------------------------------------

---[FILE: list_secrets.go]---
Location: harness-main/app/api/handler/space/list_secrets.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListSecrets(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListSecrets
```

--------------------------------------------------------------------------------

---[FILE: list_service_accounts.go]---
Location: harness-main/app/api/handler/space/list_service_accounts.go
Signals: N/A
Excerpt (<=80 chars): func HandleListServiceAccounts(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListServiceAccounts
```

--------------------------------------------------------------------------------

---[FILE: list_templates.go]---
Location: harness-main/app/api/handler/space/list_templates.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListTemplates(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListTemplates
```

--------------------------------------------------------------------------------

---[FILE: membership_add.go]---
Location: harness-main/app/api/handler/space/membership_add.go
Signals: N/A
Excerpt (<=80 chars): func HandleMembershipAdd(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMembershipAdd
```

--------------------------------------------------------------------------------

---[FILE: membership_delete.go]---
Location: harness-main/app/api/handler/space/membership_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleMembershipDelete(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMembershipDelete
```

--------------------------------------------------------------------------------

````
