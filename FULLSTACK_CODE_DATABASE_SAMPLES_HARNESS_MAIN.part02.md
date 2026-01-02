---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 2
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 2 of 37)

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

---[FILE: branch_change_target.go]---
Location: harness-main/app/api/controller/pullreq/branch_change_target.go
Signals: N/A
Excerpt (<=80 chars):  type ChangeTargetBranchInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeTargetBranchInput
- ChangeTargetBranch
```

--------------------------------------------------------------------------------

---[FILE: branch_delete.go]---
Location: harness-main/app/api/controller/pullreq/branch_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteBranch(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteBranch
```

--------------------------------------------------------------------------------

---[FILE: branch_restore.go]---
Location: harness-main/app/api/controller/pullreq/branch_restore.go
Signals: N/A
Excerpt (<=80 chars): type RestoreBranchInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestoreBranchInput
- RestoreBranch
```

--------------------------------------------------------------------------------

---[FILE: check_list.go]---
Location: harness-main/app/api/controller/pullreq/check_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListChecks(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListChecks
```

--------------------------------------------------------------------------------

---[FILE: codeowner.go]---
Location: harness-main/app/api/controller/pullreq/codeowner.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) CodeOwners(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeOwners
- mapCodeOwnerEvaluation
- mapOwner
```

--------------------------------------------------------------------------------

---[FILE: comment_apply_suggestions.go]---
Location: harness-main/app/api/controller/pullreq/comment_apply_suggestions.go
Signals: N/A
Excerpt (<=80 chars):  type SuggestionReference struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SuggestionReference
- CommentApplySuggestionsInput
- CommentApplySuggestionsOutput
- activityUpdate
- sanitize
- CommentApplySuggestions
```

--------------------------------------------------------------------------------

---[FILE: comment_create.go]---
Location: harness-main/app/api/controller/pullreq/comment_create.go
Signals: N/A
Excerpt (<=80 chars):  type CommentCreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentCreateInput
- IsReply
- IsCodeComment
- Sanitize
- CommentCreate
- checkIsReplyable
- writeActivity
- writeReplyActivity
- getCommentActivity
- setAsCodeComment
- fetchDiffCut
- migrateCodeComment
- reportCommentCreated
- appendMetadataUpdateForSuggestions
- appendMetadataUpdateForMentions
```

--------------------------------------------------------------------------------

---[FILE: comment_delete.go]---
Location: harness-main/app/api/controller/pullreq/comment_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) CommentDelete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentDelete
```

--------------------------------------------------------------------------------

---[FILE: comment_status.go]---
Location: harness-main/app/api/controller/pullreq/comment_status.go
Signals: N/A
Excerpt (<=80 chars):  type CommentStatusInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentStatusInput
- Validate
- hasChanges
- CommentStatus
```

--------------------------------------------------------------------------------

---[FILE: comment_update.go]---
Location: harness-main/app/api/controller/pullreq/comment_update.go
Signals: N/A
Excerpt (<=80 chars):  type CommentUpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentUpdateInput
- Sanitize
- hasChanges
- CommentUpdate
- reportCommentUpdated
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/pullreq/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- verifyBranchExistence
- getRepo
- getRepoCheckAccess
- fetchRules
- getCommentForPR
- getCommentCheckEditAccess
- getCommentCheckChangeStatusAccess
- checkIfAlreadyExists
- eventBase
- validateTitle
- validateDescription
- validateComment
```

--------------------------------------------------------------------------------

---[FILE: file_view_add.go]---
Location: harness-main/app/api/controller/pullreq/file_view_add.go
Signals: N/A
Excerpt (<=80 chars):  type FileViewAddInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileViewAddInput
- Validate
- FileViewAdd
```

--------------------------------------------------------------------------------

---[FILE: file_view_delete.go]---
Location: harness-main/app/api/controller/pullreq/file_view_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FileViewDelete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileViewDelete
```

--------------------------------------------------------------------------------

---[FILE: file_view_list.go]---
Location: harness-main/app/api/controller/pullreq/file_view_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FileViewList(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileViewList
```

--------------------------------------------------------------------------------

---[FILE: label_assign.go]---
Location: harness-main/app/api/controller/pullreq/label_assign.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) AssignLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AssignLabel
- activityPayload
```

--------------------------------------------------------------------------------

---[FILE: label_list.go]---
Location: harness-main/app/api/controller/pullreq/label_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListLabels(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListLabels
```

--------------------------------------------------------------------------------

---[FILE: label_unassign.go]---
Location: harness-main/app/api/controller/pullreq/label_unassign.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UnassignLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnassignLabel
```

--------------------------------------------------------------------------------

---[FILE: mentions.go]---
Location: harness-main/app/api/controller/pullreq/mentions.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) processMentions(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- processMentions
- parseMentions
```

--------------------------------------------------------------------------------

---[FILE: merge.go]---
Location: harness-main/app/api/controller/pullreq/merge.go
Signals: N/A
Excerpt (<=80 chars):  type MergeInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeInput
- sanitize
- backfillApprovalInfo
- Merge
```

--------------------------------------------------------------------------------

---[FILE: pr_branch_candidates.go]---
Location: harness-main/app/api/controller/pullreq/pr_branch_candidates.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) PRBranchCandidates(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PRBranchCandidates
```

--------------------------------------------------------------------------------

---[FILE: pr_commits.go]---
Location: harness-main/app/api/controller/pullreq/pr_commits.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Commits(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Commits
```

--------------------------------------------------------------------------------

---[FILE: pr_create.go]---
Location: harness-main/app/api/controller/pullreq/pr_create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Sanitize
- Create
- prepareRequestedReviewers
- createPullReqVerify
- getCodeOwnerReviewers
- getDefaultReviewers
- createUserReviewers
- createUserGroupReviewers
- storeCreateReviewerActivity
- storeCreateUserGroupReviewerActivity
- prepareLabels
- assignLabels
- backfillWithLabelAssignInfo
- storeLabelAssignActivity
```

--------------------------------------------------------------------------------

---[FILE: pr_diff.go]---
Location: harness-main/app/api/controller/pullreq/pr_diff.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RawDiff(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RawDiff
- Diff
```

--------------------------------------------------------------------------------

---[FILE: pr_find.go]---
Location: harness-main/app/api/controller/pullreq/pr_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
- FindByBranches
```

--------------------------------------------------------------------------------

---[FILE: pr_list.go]---
Location: harness-main/app/api/controller/pullreq/pr_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: pr_state.go]---
Location: harness-main/app/api/controller/pullreq/pr_state.go
Signals: N/A
Excerpt (<=80 chars):  type StateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StateInput
- Check
- State
```

--------------------------------------------------------------------------------

---[FILE: pr_update.go]---
Location: harness-main/app/api/controller/pullreq/pr_update.go
Signals: N/A
Excerpt (<=80 chars):  type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Sanitize
- Update
```

--------------------------------------------------------------------------------

---[FILE: revert.go]---
Location: harness-main/app/api/controller/pullreq/revert.go
Signals: N/A
Excerpt (<=80 chars):  type RevertInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevertInput
- sanitize
- Revert
```

--------------------------------------------------------------------------------

---[FILE: reviewer_add.go]---
Location: harness-main/app/api/controller/pullreq/reviewer_add.go
Signals: N/A
Excerpt (<=80 chars):  type ReviewerAddInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewerAddInput
- ReviewerAdd
- reportReviewerAddition
- newPullReqReviewer
```

--------------------------------------------------------------------------------

---[FILE: reviewer_combined_list.go]---
Location: harness-main/app/api/controller/pullreq/reviewer_combined_list.go
Signals: N/A
Excerpt (<=80 chars):  type CombinedListResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CombinedListResponse
- ReviewersListCombined
- userGroupReviewerDecisions
- determineUserGroupCompoundDecision
- getHighestOrderDecision
```

--------------------------------------------------------------------------------

---[FILE: reviewer_delete.go]---
Location: harness-main/app/api/controller/pullreq/reviewer_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ReviewerDelete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewerDelete
```

--------------------------------------------------------------------------------

---[FILE: reviewer_list.go]---
Location: harness-main/app/api/controller/pullreq/reviewer_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ReviewerList(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewerList
```

--------------------------------------------------------------------------------

---[FILE: review_submit.go]---
Location: harness-main/app/api/controller/pullreq/review_submit.go
Signals: N/A
Excerpt (<=80 chars):  type ReviewSubmitInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewSubmitInput
- Validate
- ReviewSubmit
- updateReviewer
```

--------------------------------------------------------------------------------

---[FILE: suggestions.go]---
Location: harness-main/app/api/controller/pullreq/suggestions.go
Signals: N/A
Excerpt (<=80 chars):  type suggestion struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- suggestion
- parseSuggestions
- hashCodeBlock
- findNextMarkdownCodeBlock
- trimMarkdownWhitespace
- foreachLine
- cutLongestPrefix
```

--------------------------------------------------------------------------------

---[FILE: suggestions_test.go]---
Location: harness-main/app/api/controller/pullreq/suggestions_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_parseSuggestions(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test_parseSuggestions
```

--------------------------------------------------------------------------------

---[FILE: usergroup_reviewer_add.go]---
Location: harness-main/app/api/controller/pullreq/usergroup_reviewer_add.go
Signals: N/A
Excerpt (<=80 chars):  type UserGroupReviewerAddInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserGroupReviewerAddInput
- UserGroupReviewerAdd
- reportUserGroupReviewerAdded
- reviewersMap
```

--------------------------------------------------------------------------------

---[FILE: usergroup_reviewer_delete.go]---
Location: harness-main/app/api/controller/pullreq/usergroup_reviewer_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UserGroupReviewerDelete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserGroupReviewerDelete
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/pullreq/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: archive.go]---
Location: harness-main/app/api/controller/repo/archive.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Archive(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Archive
```

--------------------------------------------------------------------------------

---[FILE: blame.go]---
Location: harness-main/app/api/controller/repo/blame.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Blame(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Blame
```

--------------------------------------------------------------------------------

---[FILE: check.go]---
Location: harness-main/app/api/controller/repo/check.go
Signals: N/A
Excerpt (<=80 chars):  type CheckInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckInput
- Check
```

--------------------------------------------------------------------------------

---[FILE: codeowner_validate.go]---
Location: harness-main/app/api/controller/repo/codeowner_validate.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) CodeOwnersValidate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeOwnersValidate
```

--------------------------------------------------------------------------------

---[FILE: commit.go]---
Location: harness-main/app/api/controller/repo/commit.go
Signals: N/A
Excerpt (<=80 chars): type CommitFileAction struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommitFileAction
- CommitFilesOptions
- Sanitize
- mapChangedFiles
- CommitFiles
```

--------------------------------------------------------------------------------

---[FILE: content_get.go]---
Location: harness-main/app/api/controller/repo/content_get.go
Signals: N/A
Excerpt (<=80 chars):  type ContentType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContentInfo
- GetContentOutput
- Content
- FileContent
- SymlinkContent
- DirContent
- SubmoduleContent
- isContent
- GetContent
- getSubmoduleContent
- getFileContent
- getSymlinkContent
- getDirContent
- mapToContentInfo
- mapNodeModeToContentType
```

--------------------------------------------------------------------------------

---[FILE: content_paths_details.go]---
Location: harness-main/app/api/controller/repo/content_paths_details.go
Signals: N/A
Excerpt (<=80 chars):  type PathsDetailsInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PathsDetailsInput
- PathsDetailsOutput
- PathsDetails
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/repo/controller.go
Signals: N/A
Excerpt (<=80 chars):  type RepositoryOutput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryOutput
- DotRange
- MarshalJSON
- NewController
- getRepoCheckAccess
- getRepoCheckAccessWithLinked
- getRepoCheckAccessForGit
- getSpaceCheckAuthRepoCreation
- ValidateParentRef
- eventBase
- fetchBranchRules
- fetchTagRules
- fetchUpstreamBranch
- fetchUpstreamRevision
- fetchUpstreamObjects
- fetchCommitDivergenceObjectsFromUpstream
- fetchDotRangeObjectsFromUpstream
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/repo/create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- CreateFileOptions
- Create
- sanitizeCreateInput
- createGitRepository
- createReadme
- identityFromPrincipal
```

--------------------------------------------------------------------------------

---[FILE: create_branch.go]---
Location: harness-main/app/api/controller/repo/create_branch.go
Signals: N/A
Excerpt (<=80 chars): type CreateBranchInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateBranchInput
- CreateBranch
```

--------------------------------------------------------------------------------

---[FILE: create_commit_tag.go]---
Location: harness-main/app/api/controller/repo/create_commit_tag.go
Signals: N/A
Excerpt (<=80 chars): type CreateCommitTagInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCommitTagInput
- CreateCommitTag
```

--------------------------------------------------------------------------------

---[FILE: create_fork.go]---
Location: harness-main/app/api/controller/repo/create_fork.go
Signals: N/A
Excerpt (<=80 chars):  type CreateForkInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateForkInput
- sanitize
- CreateFork
```

--------------------------------------------------------------------------------

---[FILE: default_branch.go]---
Location: harness-main/app/api/controller/repo/default_branch.go
Signals: N/A
Excerpt (<=80 chars):  type UpdateDefaultBranchInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateDefaultBranchInput
- UpdateDefaultBranch
```

--------------------------------------------------------------------------------

---[FILE: delete_branch.go]---
Location: harness-main/app/api/controller/repo/delete_branch.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteBranch(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteBranch
```

--------------------------------------------------------------------------------

---[FILE: delete_commit_tag.go]---
Location: harness-main/app/api/controller/repo/delete_commit_tag.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteCommitTag(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteCommitTag
```

--------------------------------------------------------------------------------

---[FILE: diff.go]---
Location: harness-main/app/api/controller/repo/diff.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) RawDiff(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RawDiff
- CommitDiff
- DiffStats
- Diff
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/repo/find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Find(ctx context.Context, session *auth.Session, repoRef...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: fork_sync.go]---
Location: harness-main/app/api/controller/repo/fork_sync.go
Signals: N/A
Excerpt (<=80 chars):  type ForkSyncInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ForkSyncInput
- sanitize
- ForkSync
```

--------------------------------------------------------------------------------

---[FILE: get_branch.go]---
Location: harness-main/app/api/controller/repo/get_branch.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) GetBranch(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetBranch
```

--------------------------------------------------------------------------------

---[FILE: get_commit.go]---
Location: harness-main/app/api/controller/repo/get_commit.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) GetCommit(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetCommit
```

--------------------------------------------------------------------------------

---[FILE: get_commit_divergences.go]---
Location: harness-main/app/api/controller/repo/get_commit_divergences.go
Signals: N/A
Excerpt (<=80 chars):  type GetCommitDivergencesInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetCommitDivergencesInput
- CommitDivergenceRequest
- GetCommitDivergences
```

--------------------------------------------------------------------------------

---[FILE: git_info_refs.go]---
Location: harness-main/app/api/controller/repo/git_info_refs.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) GitInfoRefs(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitInfoRefs
```

--------------------------------------------------------------------------------

---[FILE: git_service_pack.go]---
Location: harness-main/app/api/controller/repo/git_service_pack.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) GitServicePack(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitServicePack
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/app/api/controller/repo/helper.go
Signals: N/A
Excerpt (<=80 chars): func GetRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRepo
- GetRepoCheckAccess
- GetSpaceCheckAuthRepoCreation
- GetRepoOutput
- GetRepoOutputWithAccess
- GetRepoCheckServiceAccountAccess
```

--------------------------------------------------------------------------------

---[FILE: import.go]---
Location: harness-main/app/api/controller/repo/import.go
Signals: N/A
Excerpt (<=80 chars):  type ImportInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportInput
- Import
- sanitizeImportInput
```

--------------------------------------------------------------------------------

---[FILE: import_progress.go]---
Location: harness-main/app/api/controller/repo/import_progress.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ImportProgress(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportProgress
```

--------------------------------------------------------------------------------

---[FILE: label_define.go]---
Location: harness-main/app/api/controller/repo/label_define.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DefineLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefineLabel
```

--------------------------------------------------------------------------------

---[FILE: label_delete.go]---
Location: harness-main/app/api/controller/repo/label_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteLabel
```

--------------------------------------------------------------------------------

---[FILE: label_find.go]---
Location: harness-main/app/api/controller/repo/label_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FindLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindLabel
```

--------------------------------------------------------------------------------

---[FILE: label_list.go]---
Location: harness-main/app/api/controller/repo/label_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListLabels(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListLabels
```

--------------------------------------------------------------------------------

---[FILE: label_save.go]---
Location: harness-main/app/api/controller/repo/label_save.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) SaveLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SaveLabel
```

--------------------------------------------------------------------------------

---[FILE: label_update.go]---
Location: harness-main/app/api/controller/repo/label_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UpdateLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateLabel
```

--------------------------------------------------------------------------------

---[FILE: label_value_define.go]---
Location: harness-main/app/api/controller/repo/label_value_define.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DefineLabelValue(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefineLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_delete.go]---
Location: harness-main/app/api/controller/repo/label_value_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteLabelValue(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteLabelValue
```

--------------------------------------------------------------------------------

---[FILE: label_value_list.go]---
Location: harness-main/app/api/controller/repo/label_value_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListLabelValues(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListLabelValues
```

--------------------------------------------------------------------------------

---[FILE: label_value_update.go]---
Location: harness-main/app/api/controller/repo/label_value_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UpdateLabelValue(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateLabelValue
```

--------------------------------------------------------------------------------

---[FILE: linked_create.go]---
Location: harness-main/app/api/controller/repo/linked_create.go
Signals: N/A
Excerpt (<=80 chars):  type LinkedCreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkedCreateInput
- sanitize
- LinkedCreate
- verifyConnectorAccess
```

--------------------------------------------------------------------------------

---[FILE: linked_sync.go]---
Location: harness-main/app/api/controller/repo/linked_sync.go
Signals: N/A
Excerpt (<=80 chars):  type LinkedSyncInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkedSyncInput
- LinkedSyncOutput
- sanitize
- LinkedSync
```

--------------------------------------------------------------------------------

---[FILE: list_branches.go]---
Location: harness-main/app/api/controller/repo/list_branches.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListBranches(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- branchMetadataOutput
- ListBranches
- collectBranchMetadata
- apply
- mapToRPCBranchSortOption
- mapToRPCSortOrder
```

--------------------------------------------------------------------------------

---[FILE: list_commits.go]---
Location: harness-main/app/api/controller/repo/list_commits.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListCommits(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListCommits
- contributorsRegex
```

--------------------------------------------------------------------------------

---[FILE: list_commit_tags.go]---
Location: harness-main/app/api/controller/repo/list_commit_tags.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListCommitTags(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListCommitTags
- mapToRPCTagSortOption
```

--------------------------------------------------------------------------------

---[FILE: list_paths.go]---
Location: harness-main/app/api/controller/repo/list_paths.go
Signals: N/A
Excerpt (<=80 chars):  type ListPathsOutput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPathsOutput
- ListPaths
```

--------------------------------------------------------------------------------

---[FILE: list_pipelines.go]---
Location: harness-main/app/api/controller/repo/list_pipelines.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListPipelines(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPipelines
```

--------------------------------------------------------------------------------

---[FILE: list_service_accounts.go]---
Location: harness-main/app/api/controller/repo/list_service_accounts.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListServiceAccounts(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListServiceAccounts
```

--------------------------------------------------------------------------------

---[FILE: merge_check.go]---
Location: harness-main/app/api/controller/repo/merge_check.go
Signals: N/A
Excerpt (<=80 chars):  type MergeCheck struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeCheck
```

--------------------------------------------------------------------------------

---[FILE: move.go]---
Location: harness-main/app/api/controller/repo/move.go
Signals: N/A
Excerpt (<=80 chars): type MoveInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MoveInput
- hasChanges
- Move
- MoveNoAuth
- sanitizeMoveInput
```

--------------------------------------------------------------------------------

---[FILE: no_op_checks.go]---
Location: harness-main/app/api/controller/repo/no_op_checks.go
Signals: N/A
Excerpt (<=80 chars):  type NoOpRepoChecks struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoOpRepoChecks
- NewNoOpRepoChecks
- Create
- LifecycleRestriction
```

--------------------------------------------------------------------------------

---[FILE: pipeline_generate.go]---
Location: harness-main/app/api/controller/repo/pipeline_generate.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) PipelineGenerate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PipelineGenerate
```

--------------------------------------------------------------------------------

---[FILE: purge.go]---
Location: harness-main/app/api/controller/repo/purge.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Purge(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Purge
- PurgeNoAuth
- DeleteGitRepository
```

--------------------------------------------------------------------------------

---[FILE: raw.go]---
Location: harness-main/app/api/controller/repo/raw.go
Signals: N/A
Excerpt (<=80 chars):  type RawContent struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RawContent
- Raw
```

--------------------------------------------------------------------------------

---[FILE: rebase.go]---
Location: harness-main/app/api/controller/repo/rebase.go
Signals: N/A
Excerpt (<=80 chars):  type RebaseInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RebaseInput
- validate
- Rebase
```

--------------------------------------------------------------------------------

---[FILE: restore.go]---
Location: harness-main/app/api/controller/repo/restore.go
Signals: N/A
Excerpt (<=80 chars):  type RestoreInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestoreInput
- Restore
- RestoreNoAuth
```

--------------------------------------------------------------------------------

---[FILE: rule_create.go]---
Location: harness-main/app/api/controller/repo/rule_create.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleCreate(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleCreate
```

--------------------------------------------------------------------------------

---[FILE: rule_delete.go]---
Location: harness-main/app/api/controller/repo/rule_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleDelete(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleDelete
```

--------------------------------------------------------------------------------

---[FILE: rule_find.go]---
Location: harness-main/app/api/controller/repo/rule_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleFind(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleFind
```

--------------------------------------------------------------------------------

---[FILE: rule_list.go]---
Location: harness-main/app/api/controller/repo/rule_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleList(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleList
```

--------------------------------------------------------------------------------

---[FILE: rule_update.go]---
Location: harness-main/app/api/controller/repo/rule_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RuleUpdate(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleUpdate
```

--------------------------------------------------------------------------------

---[FILE: soft_delete.go]---
Location: harness-main/app/api/controller/repo/soft_delete.go
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

---[FILE: squash.go]---
Location: harness-main/app/api/controller/repo/squash.go
Signals: N/A
Excerpt (<=80 chars):  type SquashInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SquashInput
- validate
- Squash
```

--------------------------------------------------------------------------------

---[FILE: summary.go]---
Location: harness-main/app/api/controller/repo/summary.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Summary(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Summary
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/repo/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- hasChanges
- hasTagChanges
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: update_public_access.go]---
Location: harness-main/app/api/controller/repo/update_public_access.go
Signals: N/A
Excerpt (<=80 chars):  type UpdatePublicAccessInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdatePublicAccessInput
- UpdatePublicAccess
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/repo/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
- ProvideRepoCheck
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/reposettings/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getRepoCheckAccess
```

--------------------------------------------------------------------------------

---[FILE: general.go]---
Location: harness-main/app/api/controller/reposettings/general.go
Signals: N/A
Excerpt (<=80 chars): type GeneralSettings struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GeneralSettings
- GetDefaultGeneralSettings
- GetGeneralSettingsMappings
- GetGeneralSettingsAsKeyValues
```

--------------------------------------------------------------------------------

---[FILE: general_find.go]---
Location: harness-main/app/api/controller/reposettings/general_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) GeneralFind(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GeneralFind
```

--------------------------------------------------------------------------------

---[FILE: general_update.go]---
Location: harness-main/app/api/controller/reposettings/general_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) GeneralUpdate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GeneralUpdate
```

--------------------------------------------------------------------------------

---[FILE: security.go]---
Location: harness-main/app/api/controller/reposettings/security.go
Signals: N/A
Excerpt (<=80 chars): type SecuritySettings struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecuritySettings
- GetDefaultSecuritySettings
- GetSecuritySettingsMappings
- GetSecuritySettingsAsKeyValues
```

--------------------------------------------------------------------------------

---[FILE: security_find.go]---
Location: harness-main/app/api/controller/reposettings/security_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) SecurityFind(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityFind
```

--------------------------------------------------------------------------------

````
