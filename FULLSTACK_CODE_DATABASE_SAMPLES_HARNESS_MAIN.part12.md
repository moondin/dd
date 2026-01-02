---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 12
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 12 of 37)

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

---[FILE: wire.go]---
Location: harness-main/app/store/cache/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideEvictorSpaceCore(pubsub pubsub.PubSub) Evictor[*types.SpaceCore] {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideEvictorSpaceCore
- ProvideEvictorRepositoryCore
- ProvidePrincipalInfoCache
- ProvideSpaceIDCache
- ProvideSpacePathCache
- ProvideRepoIDCache
- ProvideRepoRefCache
- ProvideInfraProviderResourceCache
```

--------------------------------------------------------------------------------

---[FILE: ai_task.go]---
Location: harness-main/app/store/database/ai_task.go
Signals: N/A
Excerpt (<=80 chars):  type aiTask struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- aiTask
- aiTaskStore
- NewAITaskStore
- Create
- Update
- Find
- FindByIdentifier
- List
- Count
- addAITaskFilter
- mapDBToAITask
- mapToAITasks
```

--------------------------------------------------------------------------------

---[FILE: branch.go]---
Location: harness-main/app/store/database/branch.go
Signals: N/A
Excerpt (<=80 chars): type branch struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- branch
- branchStore
- NewBranchStore
- ToType
- mapInternalBranch
- FindBranchesWithoutOpenPRs
- Find
- Delete
- Upsert
- UpdateLastPR
```

--------------------------------------------------------------------------------

---[FILE: cde_gateway.go]---
Location: harness-main/app/store/database/cde_gateway.go
Signals: N/A
Excerpt (<=80 chars): func NewCDEGatewayStore(db *sqlx.DB) *CDEGatewayStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CDEGatewayStore
- cdeGateway
- NewCDEGatewayStore
- Upsert
- List
- entitiesToDTOs
- entityToDTO
```

--------------------------------------------------------------------------------

---[FILE: check.go]---
Location: harness-main/app/store/database/check.go
Signals: N/A
Excerpt (<=80 chars): func NewCheckStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckStore
- check
- NewCheckStore
- FindByIdentifier
- Upsert
- Count
- List
- ListRecent
- ListRecentSpace
- ListResults
- ResultSummary
- applyOpts
- mapInternalCheck
- mapCheck
- mapSliceCheck
```

--------------------------------------------------------------------------------

---[FILE: code_comment.go]---
Location: harness-main/app/store/database/code_comment.go
Signals: N/A
Excerpt (<=80 chars): func NewCodeCommentView(db *sqlx.DB) *CodeCommentView {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeCommentView
- NewCodeCommentView
- ListNotAtSourceSHA
- ListNotAtMergeBaseSHA
- list
- UpdateAll
```

--------------------------------------------------------------------------------

---[FILE: connector.go]---
Location: harness-main/app/store/database/connector.go
Signals: N/A
Excerpt (<=80 chars):  type connector struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- connector
- connectorStore
- NewConnectorStore
- mapFromDBConnectors
- mapToDBConnector
- convertConfigToDB
- secretIdentiferToID
- mapFromDBConnector
- populateConnectorData
- parseGithubConnectorData
- parseAuthenticationData
- convertToRef
- Find
- FindByIdentifier
- Create
- Update
- UpdateOptLock
- List
```

--------------------------------------------------------------------------------

---[FILE: database.go]---
Location: harness-main/app/store/database/database.go
Signals: N/A
Excerpt (<=80 chars): func PartialMatch(column, value string) (string, string) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PartialMatch
```

--------------------------------------------------------------------------------

---[FILE: encode.go]---
Location: harness-main/app/store/database/encode.go
Signals: N/A
Excerpt (<=80 chars): func EncodeToSQLXJSON(v any) sqlx.JSONText {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EncodeToSQLXJSON
```

--------------------------------------------------------------------------------

---[FILE: execution.go]---
Location: harness-main/app/store/database/execution.go
Signals: N/A
Excerpt (<=80 chars): func NewExecutionStore(db *sqlx.DB) store.ExecutionStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- executionStore
- execution
- executionPipelineRepoJoin
- NewExecutionStore
- Find
- FindByNumber
- Create
- Update
- List
- ListInSpace
- ListByPipelineIDs
- Count
- CountInSpace
- Delete
- convertExecutionPipelineRepoJoins
- convertExecutionPipelineRepoJoin
```

--------------------------------------------------------------------------------

---[FILE: execution_map.go]---
Location: harness-main/app/store/database/execution_map.go
Signals: N/A
Excerpt (<=80 chars):  func mapInternalToExecution(in *execution) (*types.Execution, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapInternalToExecution
- mapExecutionToInternal
- mapInternalToExecutionList
```

--------------------------------------------------------------------------------

---[FILE: favorite.go]---
Location: harness-main/app/store/database/favorite.go
Signals: N/A
Excerpt (<=80 chars): func NewFavoriteStore(db *sqlx.DB) *FavoriteStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FavoriteStore
- favorite
- NewFavoriteStore
- Create
- Map
- Delete
- getTableAndColumnName
```

--------------------------------------------------------------------------------

---[FILE: gitspace_config.go]---
Location: harness-main/app/store/database/gitspace_config.go
Signals: N/A
Excerpt (<=80 chars):  type gitspaceConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspaceConfig
- gitspaceConfigWithLatestInstance
- gitspaceConfigStore
- NewGitspaceConfigStore
- Count
- Find
- FindByIdentifier
- FindAllByIdentifier
- Create
- Update
- mapToInternalGitspaceConfig
- ListWithLatestInstance
- getLatestInstanceQuery
- addGitspaceFilter
- addOrderBy
- FindAll
- ListActiveConfigsForInfraProviderResource
- mapDBToGitspaceConfig
```

--------------------------------------------------------------------------------

---[FILE: gitspace_event.go]---
Location: harness-main/app/store/database/gitspace_event.go
Signals: N/A
Excerpt (<=80 chars):  type gitspaceEventStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspaceEventStore
- gitspaceEvent
- NewGitspaceEventStore
- FindLatestByTypeAndGitspaceConfigID
- Create
- List
- setQueryFilter
- setSortFilter
- setPaginationFilter
- mapGitspaceEvents
- mapGitspaceEvent
```

--------------------------------------------------------------------------------

---[FILE: gitspace_instance.go]---
Location: harness-main/app/store/database/gitspace_instance.go
Signals: N/A
Excerpt (<=80 chars):  type gitspaceInstance struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspaceInstance
- gitspaceInstanceStore
- NewGitspaceInstanceStore
- FindTotalUsage
- Find
- FindByIdentifier
- Create
- Update
- FindLatestByGitspaceConfigID
- List
- Count
- FindAllLatestByGitspaceConfigID
- addGitspaceInstanceFilter
- mapDBToGitspaceInstance
- mapToGitspaceInstances
- validateActiveTimeDetails
```

--------------------------------------------------------------------------------

---[FILE: gitspace_settings.go]---
Location: harness-main/app/store/database/gitspace_settings.go
Signals: N/A
Excerpt (<=80 chars):  type gitspaceSettingsStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspaceSettingsStore
- gitspaceSettings
- List
- Upsert
- FindByType
- NewGitspaceSettingsStore
- mapGitspaceSettings
- mapToGitspaceSettings
- mapToInternalGitspaceSettings
```

--------------------------------------------------------------------------------

---[FILE: git_signature_result.go]---
Location: harness-main/app/store/database/git_signature_result.go
Signals: N/A
Excerpt (<=80 chars): func NewGitSignatureResultStore(db *sqlx.DB) GitSignatureResultStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitSignatureResultStore
- gitSignatureResult
- NewGitSignatureResultStore
- Map
- Create
- TryCreateAll
- UpdateAll
- mapToInternalGitSignatureResult
- mapToGitSignatureResult
```

--------------------------------------------------------------------------------

---[FILE: infra_provider_config.go]---
Location: harness-main/app/store/database/infra_provider_config.go
Signals: N/A
Excerpt (<=80 chars):  type infraProviderConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infraProviderConfig
- infraProviderConfigStore
- NewInfraProviderConfigStore
- FindByType
- Update
- Find
- List
- FindByIdentifier
- Create
- Delete
- mapToInfraProviderConfig
- mapToInfraProviderConfigs
- mapToInternalInfraProviderConfig
```

--------------------------------------------------------------------------------

---[FILE: infra_provider_resource.go]---
Location: harness-main/app/store/database/infra_provider_resource.go
Signals: N/A
Excerpt (<=80 chars):  type infraProviderResource struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infraProviderResource
- infraProviderResourceStore
- InfraProviderResourceView
- NewInfraProviderResourceStore
- List
- Find
- FindByConfigAndIdentifier
- Create
- mapToInfraProviderResource
- toInfraProviderResource
- mapToInfraProviderResources
- NewInfraProviderResourceView
- findInfraProviderConfig
- FindMany
- Delete
- Update
```

--------------------------------------------------------------------------------

---[FILE: infra_provider_template.go]---
Location: harness-main/app/store/database/infra_provider_template.go
Signals: N/A
Excerpt (<=80 chars):  type infraProviderTemplateStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infraProviderTemplateStore
- infraProviderTemplate
- NewInfraProviderTemplateStore
- FindByIdentifier
- Find
- Create
- Update
- Delete
- mapToInternalInfraProviderTemplate
- mapToDTO
```

--------------------------------------------------------------------------------

---[FILE: infra_provisioned.go]---
Location: harness-main/app/store/database/infra_provisioned.go
Signals: N/A
Excerpt (<=80 chars):  type infraProvisionedStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- infraProvisionedStore
- infraProvisioned
- infraProvisionedGatewayView
- NewInfraProvisionedStore
- Find
- FindAllLatestByGateway
- FindLatestByGitspaceInstanceID
- FindLatestByGitspaceInstanceIdentifier
- FindStoppedInfraForGitspaceConfigIdentifierByState
- Create
- Delete
- Update
- toDTO
```

--------------------------------------------------------------------------------

---[FILE: job.go]---
Location: harness-main/app/store/database/job.go
Signals: N/A
Excerpt (<=80 chars):  func NewJobStore(db *sqlx.DB) *JobStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobStore
- NewJobStore
- Find
- DeleteByGroupID
- ListByGroupID
- Create
- Upsert
- UpdateDefinition
- UpdateExecution
- UpdateProgress
- CountRunning
- ListReady
- ListDeadlineExceeded
- NextScheduledTime
- DeleteOld
- DeleteByUID
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/app/store/database/label.go
Signals: N/A
Excerpt (<=80 chars):  type label struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- label
- labelInfo
- labelStore
- NewLabelStore
- Define
- Update
- IncrementValueCount
- Find
- FindByID
- Delete
- List
- ListInScopes
- ListInfosInScopes
- CountInSpace
- CountInRepo
- count
- CountInScopes
- UpdateParentSpace
```

--------------------------------------------------------------------------------

---[FILE: label_pullreq.go]---
Location: harness-main/app/store/database/label_pullreq.go
Signals: N/A
Excerpt (<=80 chars):  func NewPullReqLabelStore(db *sqlx.DB) store.PullReqLabelAssignmentStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullReqLabelStore
- pullReqLabel
- pullReqAssignmentInfo
- NewPullReqLabelStore
- Assign
- Unassign
- FindByLabelID
- ListAssigned
- ListAssignedByPullreqIDs
- FindValueByLabelID
- CountPullreqAssignments
- mapInternalPullReqLabel
- mapPullReqLabel
- mapPullReqAssignmentInfo
- mapPullReqAssignmentInfos
```

--------------------------------------------------------------------------------

---[FILE: label_value.go]---
Location: harness-main/app/store/database/label_value.go
Signals: N/A
Excerpt (<=80 chars):  type labelValue struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- labelValue
- labelValueInfo
- labelValueStore
- NewLabelValueStore
- Define
- Update
- Delete
- DeleteMany
- Count
- List
- ListInfosByLabelIDs
- FindByLabelID
- FindByID
- mapLabelValue
- mapSliceLabelValue
- mapInternalLabelValue
- mapLabeValuelInfo
- mapLabelValuInfos
```

--------------------------------------------------------------------------------

---[FILE: lfs_objects.go]---
Location: harness-main/app/store/database/lfs_objects.go
Signals: N/A
Excerpt (<=80 chars):  func NewLFSObjectStore(db *sqlx.DB) *LFSObjectStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LFSObjectStore
- lfsObject
- NewLFSObjectStore
- Find
- FindMany
- Create
- GetSizeInKBByRepoID
- mapInternalLFSObject
- mapLFSObject
- mapLFSObjects
```

--------------------------------------------------------------------------------

---[FILE: linked_repo.go]---
Location: harness-main/app/store/database/linked_repo.go
Signals: N/A
Excerpt (<=80 chars):  func NewLinkedRepoStore(db *sqlx.DB) *LinkedRepoStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkedRepoStore
- linkedRepo
- NewLinkedRepoStore
- Find
- Create
- Update
- UpdateOptLock
- List
```

--------------------------------------------------------------------------------

---[FILE: membership.go]---
Location: harness-main/app/store/database/membership.go
Signals: N/A
Excerpt (<=80 chars): func NewMembershipStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipStore
- membership
- membershipPrincipal
- membershipSpace
- NewMembershipStore
- Find
- FindUser
- Create
- Update
- Delete
- CountUsers
- ListUsers
- applyMembershipUserFilter
- CountSpaces
- ListSpaces
- applyMembershipSpaceFilter
- mapToMembership
- mapToInternalMembership
```

--------------------------------------------------------------------------------

---[FILE: pipeline.go]---
Location: harness-main/app/store/database/pipeline.go
Signals: N/A
Excerpt (<=80 chars): func NewPipelineStore(db *sqlx.DB) store.PipelineStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pipelineStore
- NewPipelineStore
- Find
- FindByIdentifier
- Create
- Update
- List
- ListInSpace
- ListLatest
- UpdateOptLock
- Count
- CountInSpace
- Delete
- DeleteByIdentifier
- IncrementSeqNum
```

--------------------------------------------------------------------------------

---[FILE: pipeline_join.go]---
Location: harness-main/app/store/database/pipeline_join.go
Signals: N/A
Excerpt (<=80 chars): type pipelineExecutionJoin struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pipelineExecutionJoin
- pipelineRepoJoin
- convert
- convertPipelineJoin
- convertPipelineRepoJoins
- convertPipelineRepoJoin
```

--------------------------------------------------------------------------------

---[FILE: plugin.go]---
Location: harness-main/app/store/database/plugin.go
Signals: N/A
Excerpt (<=80 chars): func NewPluginStore(db *sqlx.DB) store.PluginStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pluginStore
- NewPluginStore
- Create
- Find
- List
- ListAll
- Count
- Update
```

--------------------------------------------------------------------------------

---[FILE: principal.go]---
Location: harness-main/app/store/database/principal.go
Signals: N/A
Excerpt (<=80 chars): func NewPrincipalStore(db *sqlx.DB, uidTransformation store.PrincipalUIDTrans...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrincipalStore
- principal
- NewPrincipalStore
- Find
- FindByUID
- FindManyByUID
- FindByEmail
- FindManyByEmail
- List
- mapDBPrincipal
- mapDBPrincipals
```

--------------------------------------------------------------------------------

---[FILE: principal_info.go]---
Location: harness-main/app/store/database/principal_info.go
Signals: N/A
Excerpt (<=80 chars): func NewPrincipalInfoView(db *sqlx.DB) *PrincipalInfoView {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrincipalInfoView
- principalInfo
- NewPrincipalInfoView
- Find
- FindMany
- mapToPrincipalInfo
```

--------------------------------------------------------------------------------

---[FILE: principal_service.go]---
Location: harness-main/app/store/database/principal_service.go
Signals: N/A
Excerpt (<=80 chars): type service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindService
- FindServiceByUID
- CreateService
- UpdateService
- DeleteService
- ListServices
- CountServices
- mapDBService
- mapDBServices
- mapToDBservice
```

--------------------------------------------------------------------------------

---[FILE: principal_service_account.go]---
Location: harness-main/app/store/database/principal_service_account.go
Signals: N/A
Excerpt (<=80 chars): type serviceAccount struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- serviceAccount
- FindServiceAccount
- FindServiceAccountByUID
- FindManyServiceAccountByUID
- CreateServiceAccount
- UpdateServiceAccount
- DeleteServiceAccount
- ListServiceAccounts
- CountServiceAccounts
- mapDBServiceAccount
- mapDBServiceAccounts
- mapToDBserviceAccount
- selectServiceAccountParents
```

--------------------------------------------------------------------------------

---[FILE: principal_user.go]---
Location: harness-main/app/store/database/principal_user.go
Signals: N/A
Excerpt (<=80 chars): type user struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- user
- FindUser
- FindUserByUID
- FindUserByEmail
- CreateUser
- UpdateUser
- DeleteUser
- ListUsers
- CountUsers
- mapDBUser
- mapDBUsers
- mapToDBUser
```

--------------------------------------------------------------------------------

---[FILE: publickey.go]---
Location: harness-main/app/store/database/publickey.go
Signals: N/A
Excerpt (<=80 chars): func NewPublicKeyStore(db *sqlx.DB) PublicKeyStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicKeyStore
- publicKey
- NewPublicKeyStore
- Find
- FindByIdentifier
- Create
- Update
- DeleteByIdentifier
- MarkAsVerified
- Count
- List
- ListByFingerprint
- ListBySubKeyID
- applyQueryFilter
- applyUsages
- applySchemes
- applyPagination
```

--------------------------------------------------------------------------------

---[FILE: publickey_subkey.go]---
Location: harness-main/app/store/database/publickey_subkey.go
Signals: N/A
Excerpt (<=80 chars): func NewPublicKeySubKeyStore(db *sqlx.DB) PublicKeySubKeyStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicKeySubKeyStore
- NewPublicKeySubKeyStore
- Create
- List
```

--------------------------------------------------------------------------------

---[FILE: public_access.go]---
Location: harness-main/app/store/database/public_access.go
Signals: N/A
Excerpt (<=80 chars): func NewPublicAccessStore(db *sqlx.DB) *PublicAccessStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicAccessStore
- NewPublicAccessStore
- Find
- Create
- Delete
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/app/store/database/pullreq.go
Signals: N/A
Excerpt (<=80 chars): func NewPullReqStore(db *sqlx.DB,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqStore
- pullReq
- NewPullReqStore
- Find
- findByNumberInternal
- FindByNumberWithLock
- FindByNumber
- Create
- Update
- updateMergeCheckMetadata
- UpdateOptLock
- UpdateMergeCheckMetadataOptLock
- UpdateActivitySeq
- ResetMergeCheckStatus
- Delete
- Count
- List
- Stream
```

--------------------------------------------------------------------------------

---[FILE: pullreq_activity.go]---
Location: harness-main/app/store/database/pullreq_activity.go
Signals: N/A
Excerpt (<=80 chars): func NewPullReqActivityStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqActivityStore
- pullReqActivity
- NewPullReqActivityStore
- Find
- Create
- CreateWithPayload
- Update
- UpdateOptLock
- Count
- List
- ListAuthorIDs
- CountUnresolved
- mapPullReqActivity
- mapInternalPullReqActivity
- mapSlicePullReqActivity
- applyFilter
```

--------------------------------------------------------------------------------

---[FILE: pullreq_file_view_store.go]---
Location: harness-main/app/store/database/pullreq_file_view_store.go
Signals: N/A
Excerpt (<=80 chars): func NewPullReqFileViewStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqFileViewStore
- pullReqFileView
- NewPullReqFileViewStore
- Upsert
- DeleteByFileForPrincipal
- MarkObsolete
- List
- mapToInternalPullreqFileView
- mapToPullreqFileView
- mapToPullreqFileViews
```

--------------------------------------------------------------------------------

---[FILE: pullreq_reviewers.go]---
Location: harness-main/app/store/database/pullreq_reviewers.go
Signals: N/A
Excerpt (<=80 chars): func NewPullReqReviewerStore(db *sqlx.DB,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqReviewerStore
- pullReqReviewer
- NewPullReqReviewerStore
- Find
- Create
- Update
- Delete
- List
- mapPullReqReviewer
- mapInternalPullReqReviewer
- mapSlicePullReqReviewer
```

--------------------------------------------------------------------------------

---[FILE: pullreq_reviews.go]---
Location: harness-main/app/store/database/pullreq_reviews.go
Signals: N/A
Excerpt (<=80 chars): func NewPullReqReviewStore(db *sqlx.DB) *PullReqReviewStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqReviewStore
- pullReqReview
- NewPullReqReviewStore
- Find
- Create
- mapPullReqReview
- mapInternalPullReqReview
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/app/store/database/repo.go
Signals: N/A
Excerpt (<=80 chars): func NewRepoStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepoStore
- repository
- repoSize
- NewRepoStore
- Find
- FindDeleted
- FindActiveByUID
- FindDeletedByUID
- Create
- Update
- UpdateSize
- GetSize
- GetLFSSize
- UpdateOptLock
- updateDeletedOptLock
- SoftDelete
- Purge
```

--------------------------------------------------------------------------------

---[FILE: repo_test.go]---
Location: harness-main/app/store/database/repo_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestDatabase_GetSize(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDatabase_GetSize
- TestDatabase_Count
- TestDatabase_CountAll
- TestDatabase_List
- TestDatabase_ListAll
- createRepo
- createRepos
- createNestedSpaces
```

--------------------------------------------------------------------------------

---[FILE: rule.go]---
Location: harness-main/app/store/database/rule.go
Signals: N/A
Excerpt (<=80 chars): func NewRuleStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleStore
- rule
- ruleInfo
- NewRuleStore
- Find
- FindByIdentifier
- Create
- Update
- Delete
- Count
- List
- ListAllRepoRules
- UpdateParentSpace
- ruleTypeQuery
- applyFilter
- mapToRule
- mapToRules
- mapToInternalRule
```

--------------------------------------------------------------------------------

---[FILE: secret.go]---
Location: harness-main/app/store/database/secret.go
Signals: N/A
Excerpt (<=80 chars): func NewSecretStore(db *sqlx.DB) store.SecretStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- secretStore
- NewSecretStore
- Find
- FindByIdentifier
- Create
- Update
- UpdateOptLock
- List
- ListAll
- Delete
- DeleteByIdentifier
- Count
```

--------------------------------------------------------------------------------

---[FILE: settings.go]---
Location: harness-main/app/store/database/settings.go
Signals: N/A
Excerpt (<=80 chars): func NewSettingsStore(db *sqlx.DB) *SettingsStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsStore
- setting
- NewSettingsStore
- Find
- FindMany
- Upsert
```

--------------------------------------------------------------------------------

---[FILE: setup_test.go]---
Location: harness-main/app/store/database/setup_test.go
Signals: N/A
Excerpt (<=80 chars):  func New(dsn string) (*sqlx.DB, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- New
- setupDB
- setupStores
- createUser
- createSpace
- createSpaceTree
```

--------------------------------------------------------------------------------

---[FILE: space.go]---
Location: harness-main/app/store/database/space.go
Signals: N/A
Excerpt (<=80 chars): func NewSpaceStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpaceStore
- space
- NewSpaceStore
- Find
- FindByIDs
- FindByRef
- FindByRefCaseInsensitive
- FindByRefAndDeletedAt
- findByPathAndDeletedAt
- GetRootSpace
- GetAllRootSpaces
- GetAncestorIDs
- GetTreeLevel
- GetAncestors
- GetAncestorsData
- GetDescendantsData
```

--------------------------------------------------------------------------------

---[FILE: space_path.go]---
Location: harness-main/app/store/database/space_path.go
Signals: N/A
Excerpt (<=80 chars): func NewSpacePathStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpacePathStore
- spacePathSegment
- NewSpacePathStore
- InsertSegment
- FindPrimaryBySpaceID
- FindByPath
- DeletePrimarySegment
- DeletePathsAndDescendandPaths
- mapToInternalSpacePathSegment
```

--------------------------------------------------------------------------------

---[FILE: space_test.go]---
Location: harness-main/app/store/database/space_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestDatabase_GetRootSpace(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- row
- TestDatabase_GetRootSpace
- TestSpaceStore_FindByIDs
- createNestedSpacesForStorageSize
- createRepositoriesForSpaces
- TestSpaceStore_GetRootSpacesSize
```

--------------------------------------------------------------------------------

---[FILE: stage.go]---
Location: harness-main/app/store/database/stage.go
Signals: N/A
Excerpt (<=80 chars):  type stage struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stage
- stageStore
- NewStageStore
- FindByNumber
- Create
- ListWithSteps
- Find
- ListIncomplete
- List
- Update
```

--------------------------------------------------------------------------------

---[FILE: stage_map.go]---
Location: harness-main/app/store/database/stage_map.go
Signals: N/A
Excerpt (<=80 chars):  type nullstep struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nullstep
- convertFromNullStep
- mapInternalToStage
- mapStageToInternal
- mapInternalToStageList
- scanRowsWithSteps
- scanRowStep
```

--------------------------------------------------------------------------------

---[FILE: step.go]---
Location: harness-main/app/store/database/step.go
Signals: N/A
Excerpt (<=80 chars):  type step struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- step
- stepStore
- NewStepStore
- FindByNumber
- Create
- Update
```

--------------------------------------------------------------------------------

---[FILE: step_map.go]---
Location: harness-main/app/store/database/step_map.go
Signals: N/A
Excerpt (<=80 chars):  func mapInternalToStep(in *step) (*types.Step, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapInternalToStep
- mapStepToInternal
```

--------------------------------------------------------------------------------

---[FILE: template.go]---
Location: harness-main/app/store/database/template.go
Signals: N/A
Excerpt (<=80 chars): func NewTemplateStore(db *sqlx.DB) store.TemplateStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- templateStore
- NewTemplateStore
- Find
- FindByIdentifierAndType
- Create
- Update
- UpdateOptLock
- List
- Delete
- DeleteByIdentifierAndType
- Count
```

--------------------------------------------------------------------------------

---[FILE: token.go]---
Location: harness-main/app/store/database/token.go
Signals: N/A
Excerpt (<=80 chars): func NewTokenStore(db *sqlx.DB) *TokenStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TokenStore
- NewTokenStore
- Find
- FindByIdentifier
- Create
- Delete
- DeleteExpiredBefore
- Count
- List
```

--------------------------------------------------------------------------------

---[FILE: trigger.go]---
Location: harness-main/app/store/database/trigger.go
Signals: N/A
Excerpt (<=80 chars):  type trigger struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- trigger
- triggerStore
- mapInternalToTrigger
- mapInternalToTriggerList
- mapTriggerToInternal
- NewTriggerStore
- FindByIdentifier
- Create
- Update
- UpdateOptLock
- List
- ListAllEnabled
- Count
- DeleteByIdentifier
```

--------------------------------------------------------------------------------

---[FILE: usage_metrics.go]---
Location: harness-main/app/store/database/usage_metrics.go
Signals: N/A
Excerpt (<=80 chars):  type usageMetric struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usageMetric
- UsageMetricsStore
- NewUsageMetricsStore
- getVersion
- Upsert
- UpsertOptimistic
- GetMetrics
- List
- Date
```

--------------------------------------------------------------------------------

---[FILE: usage_metrics_test.go]---
Location: harness-main/app/store/database/usage_metrics_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestUsageMetricsStore_Upsert(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestUsageMetricsStore_Upsert
- TestUsageMetricsStore_UpsertOptimistic
- TestUsageMetricsStore_GetMetrics
- TestUsageMetricsStore_List
```

--------------------------------------------------------------------------------

---[FILE: usergroup.go]---
Location: harness-main/app/store/database/usergroup.go
Signals: N/A
Excerpt (<=80 chars):  func NewUserGroupStore(db *sqlx.DB) *UserGroupStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserGroupStore
- UserGroup
- NewUserGroupStore
- FindByIdentifier
- Find
- Map
- FindManyByIDs
- FindManyByIdentifiersAndSpaceID
- Create
- CreateOrUpdate
- mapUserGroup
- mapInternalUserGroup
```

--------------------------------------------------------------------------------

---[FILE: usergroup_reviewers.go]---
Location: harness-main/app/store/database/usergroup_reviewers.go
Signals: N/A
Excerpt (<=80 chars):  func NewUsergroupReviewerStore(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsergroupReviewerStore
- usergroupReviewer
- NewUsergroupReviewerStore
- Create
- Delete
- List
- Find
- mapInternalPullReqUserGroupReviewer
- mapPullReqUserGroupReviewer
- mapSlicePullReqUserGroupReviewer
```

--------------------------------------------------------------------------------

---[FILE: webhook.go]---
Location: harness-main/app/store/database/webhook.go
Signals: N/A
Excerpt (<=80 chars): func NewWebhookStore(db *sqlx.DB) *WebhookStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookStore
- webhook
- NewWebhookStore
- Find
- FindByIdentifier
- Create
- Update
- UpdateOptLock
- Delete
- DeleteByIdentifier
- Count
- List
- UpdateParentSpace
- mapToWebhook
- mapToInternalWebhook
- mapToWebhooks
- triggersFromString
- triggersToString
```

--------------------------------------------------------------------------------

---[FILE: webhook_execution.go]---
Location: harness-main/app/store/database/webhook_execution.go
Signals: N/A
Excerpt (<=80 chars): func NewWebhookExecutionStore(db *sqlx.DB) *WebhookExecutionStore {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookExecutionStore
- webhookExecution
- NewWebhookExecutionStore
- Find
- Create
- DeleteOld
- ListForWebhook
- CountForWebhook
- ListForTrigger
- mapToWebhookExecution
- mapToInternalWebhookExecution
- mapToWebhookExecutions
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/store/database/wire.go
Signals: N/A
Excerpt (<=80 chars): func migrator(ctx context.Context, db *sqlx.DB) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrator
- ProvideDatabase
- ProvidePrincipalStore
- ProvideUserGroupStore
- ProvideUserGroupReviewerStore
- ProvidePrincipalInfoView
- ProvideInfraProviderResourceView
- ProvideSpacePathStore
- ProvideSpaceStore
- ProvideRepoStore
- ProvideLinkRepoStore
- ProvideRuleStore
- ProvideJobStore
- ProvidePipelineStore
- ProvideInfraProviderConfigStore
- ProvideInfraProviderResourceStore
- ProvideGitspaceConfigStore
- ProvideGitspaceSettingsStore
```

--------------------------------------------------------------------------------

---[FILE: migrate.go]---
Location: harness-main/app/store/database/migrate/migrate.go
Signals: N/A
Excerpt (<=80 chars): func Migrate(ctx context.Context, db *sqlx.DB) (err error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Migrate
- To
- Current
- getMigrator
```

--------------------------------------------------------------------------------

---[FILE: migrate_0039_alter_table_webhooks_uid.go]---
Location: harness-main/app/store/database/migrate/migrate_0039_alter_table_webhooks_uid.go
Signals: N/A
Excerpt (<=80 chars): func migrateAfter_0039_alter_table_webhooks_uid(ctx context.Context, dbtx *sq...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhook
- migrateAfter_0039_alter_table_webhooks_uid
- WebhookDisplayNameToIdentifier
- santizeConsecutiveChars
- randomizeIdentifier
```

--------------------------------------------------------------------------------

---[FILE: migrate_0039_alter_table_webhooks_uid_test.go]---
Location: harness-main/app/store/database/migrate/migrate_0039_alter_table_webhooks_uid_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestWebhookDisplayNameToIdentifier(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestWebhookDisplayNameToIdentifier
```

--------------------------------------------------------------------------------

---[FILE: migrate_0042_alter_table_rules.go]---
Location: harness-main/app/store/database/migrate/migrate_0042_alter_table_rules.go
Signals: N/A
Excerpt (<=80 chars): func migrateAfter_0042_alter_table_rules(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rule
- migrateAfter_0042_alter_table_rules
```

--------------------------------------------------------------------------------

---[FILE: migrate_0151_migrate_artifacts.go]---
Location: harness-main/app/store/database/migrate/migrate_0151_migrate_artifacts.go
Signals: N/A
Excerpt (<=80 chars): func MigrateAfter_0153_migrate_artifacts(ctx context.Context, dbtx *sql.Tx) e...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manifest
- MigrateAfter_0153_migrate_artifacts
- getMediaTypeIDs
- getManifestsBatch
- processManifestsBatch
```

--------------------------------------------------------------------------------

---[FILE: migrate_0155_migrate_rpm_artifacts.go]---
Location: harness-main/app/store/database/migrate/migrate_0155_migrate_rpm_artifacts.go
Signals: N/A
Excerpt (<=80 chars): func MigrateAfter_0155_migrate_rpm_artifacts(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- artifact
- node
- RegistrySyncInput
- MigrateAfter_0155_migrate_rpm_artifacts
- getArtifactsBatch
- processArtifactsBatch
- scheduleIndexJob
```

--------------------------------------------------------------------------------

---[FILE: migrate_test.go]---
Location: harness-main/app/store/database/migrate/migrate_test.go
Signals: N/A
Excerpt (<=80 chars): func TestMigrationFilesExtension(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestMigrationFilesExtension
- TestMigrationFilesNumbering
- getFileParts
- extractVersion
- TestMigrationFilesNoSuffix
- TestMigrationFilesExistInBothDatabases
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_a_principals.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0001_create_table_a_principals.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE principals (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- principals
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_b_spaces.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0001_create_table_b_spaces.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE spaces (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- spaces
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_c_repositories.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0001_create_table_c_repositories.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE repositories (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- repositories
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_d_paths.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0001_create_table_d_paths.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE paths (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- paths
```

--------------------------------------------------------------------------------

---[FILE: 0001_create_table_e_tokens.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0001_create_table_e_tokens.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE tokens (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tokens
```

--------------------------------------------------------------------------------

---[FILE: 0003_create_table_pullreqs.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0003_create_table_pullreqs.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreqs (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreqs
```

--------------------------------------------------------------------------------

---[FILE: 0005_create_table_pullreq_activities.up.sql]---
Location: harness-main/app/store/database/migrate/postgres/0005_create_table_pullreq_activities.up.sql
Signals: N/A
Excerpt (<=80 chars): CREATE TABLE pullreq_activities (

```sql
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullreq_activities
```

--------------------------------------------------------------------------------

````
