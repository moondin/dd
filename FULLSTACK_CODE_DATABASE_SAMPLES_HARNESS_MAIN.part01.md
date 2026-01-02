---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 1
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 37)

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

---[FILE: auth.go]---
Location: harness-main/app/api/auth/auth.go
Signals: N/A
Excerpt (<=80 chars): func Check(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Check
- CheckAll
- CheckSessionAuth
- IsNoAccess
- CheckChild
- getScopeForParent
```

--------------------------------------------------------------------------------

---[FILE: connector.go]---
Location: harness-main/app/api/auth/connector.go
Signals: N/A
Excerpt (<=80 chars): func CheckConnector(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckConnector
```

--------------------------------------------------------------------------------

---[FILE: gitspace.go]---
Location: harness-main/app/api/auth/gitspace.go
Signals: N/A
Excerpt (<=80 chars): func CheckGitspace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckGitspace
```

--------------------------------------------------------------------------------

---[FILE: infraprovider.go]---
Location: harness-main/app/api/auth/infraprovider.go
Signals: N/A
Excerpt (<=80 chars): func CheckInfraProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckInfraProvider
```

--------------------------------------------------------------------------------

---[FILE: pipeline.go]---
Location: harness-main/app/api/auth/pipeline.go
Signals: N/A
Excerpt (<=80 chars): func CheckPipeline(ctx context.Context, authorizer authz.Authorizer, session ...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckPipeline
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/app/api/auth/registry.go
Signals: N/A
Excerpt (<=80 chars): func CheckRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckRegistry
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/app/api/auth/repo.go
Signals: N/A
Excerpt (<=80 chars): func CheckRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckRepo
- IsRepoOwner
- CheckRepoState
```

--------------------------------------------------------------------------------

---[FILE: secret.go]---
Location: harness-main/app/api/auth/secret.go
Signals: N/A
Excerpt (<=80 chars): func CheckSecret(ctx context.Context, authorizer authz.Authorizer, session *a...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckSecret
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/api/auth/service.go
Signals: N/A
Excerpt (<=80 chars): func CheckService(ctx context.Context, authorizer authz.Authorizer, session *...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckService
```

--------------------------------------------------------------------------------

---[FILE: service_account.go]---
Location: harness-main/app/api/auth/service_account.go
Signals: N/A
Excerpt (<=80 chars): func CheckServiceAccount(ctx context.Context, authorizer authz.Authorizer, se...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckServiceAccount
```

--------------------------------------------------------------------------------

---[FILE: space.go]---
Location: harness-main/app/api/auth/space.go
Signals: N/A
Excerpt (<=80 chars): func CheckSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckSpace
- CheckSpaceScope
```

--------------------------------------------------------------------------------

---[FILE: template.go]---
Location: harness-main/app/api/auth/template.go
Signals: N/A
Excerpt (<=80 chars): func CheckTemplate(ctx context.Context, authorizer authz.Authorizer, session ...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckTemplate
```

--------------------------------------------------------------------------------

---[FILE: user.go]---
Location: harness-main/app/api/auth/user.go
Signals: N/A
Excerpt (<=80 chars): func CheckUser(ctx context.Context, authorizer authz.Authorizer, session *aut...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckUser
```

--------------------------------------------------------------------------------

---[FILE: tx.go]---
Location: harness-main/app/api/controller/tx.go
Signals: N/A
Excerpt (<=80 chars): type TxOptionRetryCount int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TxOptLock
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/app/api/controller/util.go
Signals: N/A
Excerpt (<=80 chars): func createRPCWriteParams(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRPCWriteParams
- CreateRPCExternalWriteParams
- CreateRPCInternalWriteParams
- CreateRPCSystemReferencesWriteParams
- MapBranch
- MapCommit
- MapCommitTag
- mapStats
- mapFileStats
- MapRenameDetails
- MapSignature
- IdentityFromPrincipalInfo
- SystemServicePrincipalInfo
```

--------------------------------------------------------------------------------

---[FILE: check_list.go]---
Location: harness-main/app/api/controller/check/check_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListChecks(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListChecks
```

--------------------------------------------------------------------------------

---[FILE: check_recent.go]---
Location: harness-main/app/api/controller/check/check_recent.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListRecentChecks(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListRecentChecks
```

--------------------------------------------------------------------------------

---[FILE: check_recent_space.go]---
Location: harness-main/app/api/controller/check/check_recent_space.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListRecentChecksSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListRecentChecksSpace
```

--------------------------------------------------------------------------------

---[FILE: check_report.go]---
Location: harness-main/app/api/controller/check/check_report.go
Signals: N/A
Excerpt (<=80 chars):  type ReportInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReportInput
- Sanitize
- SanitizeJSONPayload
- Report
- getStartTime
- getEndTime
```

--------------------------------------------------------------------------------

---[FILE: check_report_test.go]---
Location: harness-main/app/api/controller/check/check_report_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_getStartedTime(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- args
- Test_getStartedTime
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/check/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getRepoCheckAccess
- getSpaceCheckAccess
```

--------------------------------------------------------------------------------

---[FILE: sanitizers.go]---
Location: harness-main/app/api/controller/check/sanitizers.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideCheckSanitizers() map[enum.CheckPayloadKind]func(in *ReportInput...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideCheckSanitizers
- createEmptyPayloadSanitizer
- createRawPayloadSanitizer
- createPipelinePayloadSanitizer
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/check/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/connector/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/connector/create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- validate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/connector/delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Delete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/connector/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: test.go]---
Location: harness-main/app/api/controller/connector/test.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Test(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/connector/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- validate
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/connector/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: cancel.go]---
Location: harness-main/app/api/controller/execution/cancel.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Cancel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Cancel
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/execution/controller.go
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
Location: harness-main/app/api/controller/execution/create.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Create(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Create
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/execution/delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Delete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/execution/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/execution/list.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/execution/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/app/api/controller/githook/client.go
Signals: N/A
Excerpt (<=80 chars): type ControllerClientFactory struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerClientFactory
- ControllerClient
- NewClient
- PreReceive
- Update
- PostReceive
- translateControllerError
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/githook/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getRepoCheckAccess
- GetBaseSHAForScanningChanges
- isForcePush
- logOutputFor
```

--------------------------------------------------------------------------------

---[FILE: extender.go]---
Location: harness-main/app/api/controller/githook/extender.go
Signals: N/A
Excerpt (<=80 chars):  type PreReceiveExtender interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreReceiveExtender
- UpdateExtender
- PostReceiveExtender
- NoOpPreReceiveExtender
- NoOpUpdateExtender
- NoOpPostReceiveExtender
- NewPreReceiveExtender
- Extend
- NewUpdateExtender
- NewPostReceiveExtender
```

--------------------------------------------------------------------------------

---[FILE: git.go]---
Location: harness-main/app/api/controller/githook/git.go
Signals: N/A
Excerpt (<=80 chars): type RestrictedGIT interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestrictedGIT
```

--------------------------------------------------------------------------------

---[FILE: post_receive.go]---
Location: harness-main/app/api/controller/githook/post_receive.go
Signals: N/A
Excerpt (<=80 chars): type refForcePushMap map[string]struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PostReceive
- reportReferenceEvents
- reportBranchEvent
- reportTagEvent
- handlePRMessaging
- suggestPullRequest
- getOpenPRsMessages
- getNonUniqueMergeBasePRsMessages
- appendPRs
- handleEmptyRepoPush
- updateLastGITPushTime
- logForcePush
```

--------------------------------------------------------------------------------

---[FILE: pre_receive.go]---
Location: harness-main/app/api/controller/githook/pre_receive.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) PreReceive(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- changes
- changedRefs
- PreReceive
- processPushProtection
- blockPullReqRefUpdate
- checkProtectionRules
- processRuleViolations
- groupByAction
- hasOnlyDeletedBranches
- isBranch
- isTag
- groupRefsByAction
- loggingWithRefUpdate
```

--------------------------------------------------------------------------------

---[FILE: pre_receive_process.go]---
Location: harness-main/app/api/controller/githook/pre_receive_process.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) processObjects(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- processObjects
```

--------------------------------------------------------------------------------

---[FILE: pre_receive_scan_secrets.go]---
Location: harness-main/app/api/controller/githook/pre_receive_scan_secrets.go
Signals: N/A
Excerpt (<=80 chars):  type secretFinding struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- secretFinding
- scanSecrets
- scanSecretsInternal
```

--------------------------------------------------------------------------------

---[FILE: print.go]---
Location: harness-main/app/api/controller/githook/print.go
Signals: N/A
Excerpt (<=80 chars):  func printScanSecretsFindings(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- printScanSecretsFindings
- FMTDuration
- printOversizeFiles
- printCommitterMismatch
- printLFSPointers
- singularOrPlural
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/githook/update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) Update(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Update
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/githook/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideFactory() hook.ClientFactory {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideFactory
- ProvideController
- ProvidePreReceiveExtender
- ProvideUpdateExtender
- ProvidePostReceiveExtender
```

--------------------------------------------------------------------------------

---[FILE: action.go]---
Location: harness-main/app/api/controller/gitspace/action.go
Signals: N/A
Excerpt (<=80 chars):  type ActionInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionInput
- Action
- sanitizeActionInput
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/gitspace/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/controller/gitspace/create.go
Signals: N/A
Excerpt (<=80 chars): type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- Create
- createOrFindInfraProviderResource
- autoCreateDefaultResource
- wrapString
- sanitizeCreateInput
- buildIdentifier
- validateIdentifier
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/controller/gitspace/delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Delete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/api/controller/gitspace/events.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- Events
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/gitspace/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: find_all.go]---
Location: harness-main/app/api/controller/gitspace/find_all.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) FindAllInSameScope(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindAllInSameScope
```

--------------------------------------------------------------------------------

---[FILE: list_all.go]---
Location: harness-main/app/api/controller/gitspace/list_all.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListAllGitspaces( // nolint:gocognit

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListAllGitspaces
- fetchAllLeafSpaceIDs
- filter
- getAuthorizedGitspaceConfigs
- getAuthorizedSpaces
```

--------------------------------------------------------------------------------

---[FILE: logs_stream.go]---
Location: harness-main/app/api/controller/gitspace/logs_stream.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) LogsStream(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogsStream
- marshalLine
```

--------------------------------------------------------------------------------

---[FILE: lookup_repo.go]---
Location: harness-main/app/api/controller/gitspace/lookup_repo.go
Signals: N/A
Excerpt (<=80 chars):  type LookupRepoInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LookupRepoInput
- LookupRepo
- sanitizeLookupRepoInput
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/gitspace/update.go
Signals: N/A
Excerpt (<=80 chars): type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- updateIDE
- handleSSHToken
- updateResourceIdentifier
- getResources
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/gitspace/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: resource_validation.go]---
Location: harness-main/app/api/controller/gitspace/common/resource_validation.go
Signals: N/A
Excerpt (<=80 chars): func FilterResourcesByCompatibility(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterResourcesByCompatibility
- IsResourceSpecChangeAllowed
- validatePersistentDiskChanges
- validateMachineTypeChanges
- validateBootDiskChanges
- checkPersistentDiskSizeChange
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/infraprovider/controller.go
Signals: N/A
Excerpt (<=80 chars):  type ConfigInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfigInput
- ResourceInput
- AutoCreateInput
- TemplateInput
- NewController
```

--------------------------------------------------------------------------------

---[FILE: create_config.go]---
Location: harness-main/app/api/controller/infraprovider/create_config.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) CreateConfig(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateConfig
- MapToInfraProviderConfig
- sanitizeCreateInput
```

--------------------------------------------------------------------------------

---[FILE: create_resources.go]---
Location: harness-main/app/api/controller/infraprovider/create_resources.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) CreateTemplate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTemplate
- CreateResources
- MapToResourceEntity
- sanitizeResourceInput
```

--------------------------------------------------------------------------------

---[FILE: delete_config.go]---
Location: harness-main/app/api/controller/infraprovider/delete_config.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) DeleteConfig(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteConfig
```

--------------------------------------------------------------------------------

---[FILE: delete_resource.go]---
Location: harness-main/app/api/controller/infraprovider/delete_resource.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) DeleteResource(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteResource
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/infraprovider/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/infraprovider/list.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: list_resources.go]---
Location: harness-main/app/api/controller/infraprovider/list_resources.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListResources(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListResources
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/infraprovider/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/keywordsearch/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: search.go]---
Location: harness-main/app/api/controller/keywordsearch/search.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Search(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Search
- getReposByPath
- getReposBySpacePaths
- getReposBySpacePath
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/keywordsearch/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: authenticate.go]---
Location: harness-main/app/api/controller/lfs/authenticate.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Authenticate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Authenticate
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/lfs/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getRepoCheckAccessAndSetting
- getLFSObjectPath
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/app/api/controller/lfs/download.go
Signals: N/A
Excerpt (<=80 chars):  type Content struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Content
- Read
- Close
- Download
- DownloadNoAuth
```

--------------------------------------------------------------------------------

---[FILE: transfer.go]---
Location: harness-main/app/api/controller/lfs/transfer.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) LFSTransfer(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LFSTransfer
- getRedirectRef
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/app/api/controller/lfs/types.go
Signals: N/A
Excerpt (<=80 chars):  type Reference struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reference
- Pointer
- TransferInput
- ObjectError
- Action
- ObjectResponse
- TransferOutput
- AuthenticateResponse
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/app/api/controller/lfs/upload.go
Signals: N/A
Excerpt (<=80 chars):  type UploadOut struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadOut
- Upload
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/lfs/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: gitspace.go]---
Location: harness-main/app/api/controller/limiter/gitspace.go
Signals: N/A
Excerpt (<=80 chars): type Gitspace interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gitspace
- UnlimitedUsage
- NewUnlimitedUsage
- Usage
```

--------------------------------------------------------------------------------

---[FILE: limiter.go]---
Location: harness-main/app/api/controller/limiter/limiter.go
Signals: N/A
Excerpt (<=80 chars): type ResourceLimiter interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResourceLimiter
- Unlimited
- NewResourceLimiter
- RepoCount
- RepoSize
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/limiter/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideLimiter() (ResourceLimiter, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideLimiter
- ProvideGitspaceLimiter
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/logs/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/logs/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: tail.go]---
Location: harness-main/app/api/controller/logs/tail.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Tail(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tail
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/logs/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/migrate/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getRepoCheckAccess
- getSpaceCheckAccess
```

--------------------------------------------------------------------------------

---[FILE: create_repo.go]---
Location: harness-main/app/api/controller/migrate/create_repo.go
Signals: N/A
Excerpt (<=80 chars):  type CreateRepoInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRepoInput
- CreateRepo
- spaceCheckAuth
- sanitizeCreateRepoInput
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/app/api/controller/migrate/label.go
Signals: N/A
Excerpt (<=80 chars):  type LabelsInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LabelsInput
- Labels
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/app/api/controller/migrate/pullreq.go
Signals: N/A
Excerpt (<=80 chars):  type PullreqsInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullreqsInput
- PullRequests
```

--------------------------------------------------------------------------------

---[FILE: rules.go]---
Location: harness-main/app/api/controller/migrate/rules.go
Signals: N/A
Excerpt (<=80 chars):  type RulesInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RulesInput
- Rules
```

--------------------------------------------------------------------------------

---[FILE: update_state.go]---
Location: harness-main/app/api/controller/migrate/update_state.go
Signals: N/A
Excerpt (<=80 chars):  type UpdateStateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateStateInput
- UpdateRepoState
- stateTransitionValid
```

--------------------------------------------------------------------------------

---[FILE: webhooks.go]---
Location: harness-main/app/api/controller/migrate/webhooks.go
Signals: N/A
Excerpt (<=80 chars):  type WebhooksInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhooksInput
- Webhooks
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/migrate/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/pipeline/controller.go
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
Location: harness-main/app/api/controller/pipeline/create.go
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
Location: harness-main/app/api/controller/pipeline/delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Delete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/pipeline/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/controller/pipeline/update.go
Signals: N/A
Excerpt (<=80 chars):  type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- Update
- sanitizeUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/pipeline/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/plugin/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/plugin/list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/plugin/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(pluginStore store.PluginStore) *Controller {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/principal/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newController
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/controller/principal/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c Controller) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: find_by_email.go]---
Location: harness-main/app/api/controller/principal/find_by_email.go
Signals: N/A
Excerpt (<=80 chars):  func (c Controller) CheckExistenceByEmails(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckExistenceByEmails
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/principal/list.go
Signals: N/A
Excerpt (<=80 chars):  func (c Controller) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/principal/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: activity_list.go]---
Location: harness-main/app/api/controller/pullreq/activity_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ActivityList(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActivityList
- allCommentsDeleted
- removeDeletedComments
```

--------------------------------------------------------------------------------

---[FILE: activity_list_test.go]---
Location: harness-main/app/api/controller/pullreq/activity_list_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestRemoveDeletedComments(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- activity
- TestRemoveDeletedComments
```

--------------------------------------------------------------------------------

````
