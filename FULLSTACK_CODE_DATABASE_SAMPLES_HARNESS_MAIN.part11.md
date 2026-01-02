---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 11
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 11 of 37)

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

---[FILE: service_ssh.go]---
Location: harness-main/app/services/publickey/service_ssh.go
Signals: N/A
Excerpt (<=80 chars):  type SSHAuthService interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSHAuthService
- NewSSHAuthService
- ValidateKey
```

--------------------------------------------------------------------------------

---[FILE: service_verify.go]---
Location: harness-main/app/services/publickey/service_verify.go
Signals: N/A
Excerpt (<=80 chars):  type SignatureVerifyService struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SignatureVerifyService
- VerifySession
- personalKey
- verifier
- signedObject
- NewSignatureVerifyService
- NewVerifySession
- VerifyCommitTags
- VerifyCommits
- principalByEmail
- fetchKey
- StoreSignatures
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/publickey/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideSSHAuthService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideSSHAuthService
- ProvideSignatureVerifyService
```

--------------------------------------------------------------------------------

---[FILE: parse_pgp.go]---
Location: harness-main/app/services/publickey/keypgp/parse_pgp.go
Signals: N/A
Excerpt (<=80 chars):  type KeyMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeyMetadata
- EntityMetadata
- KeyInfo
- Parse
- Matches
- Fingerprint
- Type
- Scheme
- Comment
- ValidFrom
- ValidTo
- Identities
- RevocationReason
- Metadata
- KeyIDs
- CompromisedIDs
- pgpAlgo
- getRevocationReason
```

--------------------------------------------------------------------------------

---[FILE: verify_pgp.go]---
Location: harness-main/app/services/publickey/keypgp/verify_pgp.go
Signals: N/A
Excerpt (<=80 chars):  type Verify struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Verify
- Parse
- Key
- KeyScheme
- KeyID
- KeyFingerprint
- hasSigningKey
```

--------------------------------------------------------------------------------

---[FILE: parse_ssh.go]---
Location: harness-main/app/services/publickey/keyssh/parse_ssh.go
Signals: N/A
Excerpt (<=80 chars):  func FromSSH(key gossh.PublicKey) KeyInfo {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeyInfo
- FromSSH
- Parse
- Matches
- matchesKey
- Fingerprint
- Type
- Scheme
- Comment
- ValidFrom
- ValidTo
- Identities
- RevocationReason
- Metadata
- KeyIDs
- CompromisedIDs
```

--------------------------------------------------------------------------------

---[FILE: verify_ssh.go]---
Location: harness-main/app/services/publickey/keyssh/verify_ssh.go
Signals: N/A
Excerpt (<=80 chars): type signatureBlob struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- signatureBlob
- messageWrapper
- Verify
- hashFunc
- Parse
- Key
- KeyScheme
- KeyID
- KeyFingerprint
- SignaturePublicKey
```

--------------------------------------------------------------------------------

---[FILE: validity.go]---
Location: harness-main/app/services/publickey/validity/validity.go
Signals: N/A
Excerpt (<=80 chars):  type Period struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Period
- FromSignature
- FromPublicKey
- Invalidate
- Intersect
- Revoke
- String
- Milliseconds
```

--------------------------------------------------------------------------------

---[FILE: validity_test.go]---
Location: harness-main/app/services/publickey/validity/validity_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestPeriodRevoke(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestPeriodRevoke
- TestPeriodIntersect
- fromTimes
```

--------------------------------------------------------------------------------

---[FILE: close.go]---
Location: harness-main/app/services/pullreq/close.go
Signals: N/A
Excerpt (<=80 chars):  type NonUniqueMergeBaseInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NonUniqueMergeBaseInput
- CloseBecauseNonUniqueMergeBase
```

--------------------------------------------------------------------------------

---[FILE: handlers_branch.go]---
Location: harness-main/app/services/pullreq/handlers_branch.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) updatePullReqOnBranchUpdate(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updatePullReqOnBranchUpdate
- closePullReqOnBranchDelete
- forEveryOpenPR
- getBranchFromRef
```

--------------------------------------------------------------------------------

---[FILE: handlers_code_comments.go]---
Location: harness-main/app/services/pullreq/handlers_code_comments.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) updateCodeCommentsOnBranchUpdate(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateCodeCommentsOnBranchUpdate
- updateCodeCommentsOnReopen
- updateCodeComments
```

--------------------------------------------------------------------------------

---[FILE: handlers_counters.go]---
Location: harness-main/app/services/pullreq/handlers_counters.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) updatePRCountersOnCreated(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updatePRCountersOnCreated
- updatePRCountersOnReopened
- updatePRCountersOnClosed
- updatePRCountersOnMerged
- updatePRNumbers
```

--------------------------------------------------------------------------------

---[FILE: handlers_file_viewed.go]---
Location: harness-main/app/services/pullreq/handlers_file_viewed.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) handleFileViewedOnBranchUpdate(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleFileViewedOnBranchUpdate
```

--------------------------------------------------------------------------------

---[FILE: handlers_mergeable.go]---
Location: harness-main/app/services/pullreq/handlers_mergeable.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) mergeCheckOnCreated(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mergeCheckOnCreated
- mergeCheckOnBranchUpdate
- mergeCheckOnTargetBranchChange
- mergeCheckOnReopen
- updateMergeData
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/pullreq/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- New
- createRPCSystemReferencesWriteParams
```

--------------------------------------------------------------------------------

---[FILE: service_list.go]---
Location: harness-main/app/services/pullreq/service_list.go
Signals: N/A
Excerpt (<=80 chars):  type ListService struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListService
- repoSHA
- repoBranchName
- NewListService
- CountForSpace
- ListForSpace
- streamPullReqs
- clearStats
- backfillStats
- backfillChecks
- backfillRules
- BackfillMetadata
- BackfillMetadataForRepo
- BackfillMetadataForPullReq
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/pullreq/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
- ProvideListService
```

--------------------------------------------------------------------------------

---[FILE: repo_finder.go]---
Location: harness-main/app/services/refcache/repo_finder.go
Signals: N/A
Excerpt (<=80 chars):  type RepoFinder struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepoFinder
- NewRepoFinder
- MarkChanged
- FindByID
- FindByRef
- FindDeletedByRef
```

--------------------------------------------------------------------------------

---[FILE: space_finder.go]---
Location: harness-main/app/services/refcache/space_finder.go
Signals: N/A
Excerpt (<=80 chars):  type SpaceFinder struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpaceFinder
- NewSpaceFinder
- MarkChanged
- FindByID
- FindByRef
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/refcache/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideSpaceFinder(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideSpaceFinder
- ProvideRepoFinder
```

--------------------------------------------------------------------------------

---[FILE: user_jwt_provider.go]---
Location: harness-main/app/services/remoteauth/user_jwt_provider.go
Signals: N/A
Excerpt (<=80 chars):  type Service interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalService
- NewService
- GenerateToken
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/remoteauth/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideRemoteAuth(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideRemoteAuth
```

--------------------------------------------------------------------------------

---[FILE: handlers_default_branch.go]---
Location: harness-main/app/services/repo/handlers_default_branch.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) handleUpdateDefaultBranch(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleUpdateDefaultBranch
```

--------------------------------------------------------------------------------

---[FILE: reposize.go]---
Location: harness-main/app/services/repo/reposize.go
Signals: N/A
Excerpt (<=80 chars):  type SizeCalculator struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SizeCalculator
- Register
- Handle
- worker
- sendMetric
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/repo/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/repo/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideCalculator(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideCalculator
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/app/services/rules/common.go
Signals: N/A
Excerpt (<=80 chars): func ruleTypeToResourceType(ruleType enum.RuleType) audit.ResourceType {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ruleTypeToResourceType
- getRuleUserAndUserGroups
- getRuleUsers
- getRuleUserGroups
- parseRule
- sendSSE
- backfillRuleRepositories
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/services/rules/create.go
Signals: N/A
Excerpt (<=80 chars):  type CreateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInput
- sanitize
- Create
- instrumentEventRepo
- instrumentEventSpace
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/services/rules/delete.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) Delete(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/services/rules/find.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) Find(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/services/rules/list.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) List(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
- getParentInfoRepo
- getParentInfoSpace
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/rules/service.go
Signals: N/A
Excerpt (<=80 chars): type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/services/rules/update.go
Signals: N/A
Excerpt (<=80 chars):  type UpdateInput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInput
- sanitize
- isEmpty
- Update
```

--------------------------------------------------------------------------------

---[FILE: validator.go]---
Location: harness-main/app/services/rules/validator.go
Signals: N/A
Excerpt (<=80 chars):  type Validator interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Validator
- Validate
- ValidateUsers
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/rules/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
- ProvideValidator
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/secret/service.go
Signals: N/A
Excerpt (<=80 chars):  type service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- DecryptSecret
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/secret/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideSecretService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideSecretService
```

--------------------------------------------------------------------------------

---[FILE: mapping.go]---
Location: harness-main/app/services/settings/mapping.go
Signals: N/A
Excerpt (<=80 chars): func Mapping[T any](key Key, target *T) SettingHandler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Key
- Required
- Handle
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/settings/service.go
Signals: N/A
Excerpt (<=80 chars): type KeyValue struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeyValue
- SettingHandler
- NewService
- Set
- SetMany
- Get
- Map
```

--------------------------------------------------------------------------------

---[FILE: service_repo.go]---
Location: harness-main/app/services/settings/service_repo.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) RepoSet(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepoSet
- RepoSetMany
- RepoGet
- RepoMap
```

--------------------------------------------------------------------------------

---[FILE: service_system.go]---
Location: harness-main/app/services/settings/service_system.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) SystemSet(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SystemSet
- SystemSetMany
- SystemGet
- SystemMap
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/settings/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: id.go]---
Location: harness-main/app/services/space/id.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) getJobDef(jobUID string, input Input) (job.Definition, err...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getJobDef
- getJobInput
- JobUIDFromSpacePath
```

--------------------------------------------------------------------------------

---[FILE: move.go]---
Location: harness-main/app/services/space/move.go
Signals: N/A
Excerpt (<=80 chars):  type Input struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Input
- MoveResourcesOutput
- Register
- Run
- Handle
- MoveNoAuth
- moveSpaceResourcesInTx
- cleanUpStaleSpaceResources
- cleanUpRuleRepoTargets
- filterRepoIDs
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/space/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
```

--------------------------------------------------------------------------------

---[FILE: soft_delete.go]---
Location: harness-main/app/services/space/soft_delete.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) SoftDeleteInner(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SoftDeleteInner
- softDeleteRepositoriesNoAuth
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/space/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: noop.go]---
Location: harness-main/app/services/tokengenerator/noop.go
Signals: N/A
Excerpt (<=80 chars):  type NoopTokenGenerator struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoopTokenGenerator
- NewNoopTokenGenerator
- GenerateToken
```

--------------------------------------------------------------------------------

---[FILE: tokengenerator.go]---
Location: harness-main/app/services/tokengenerator/tokengenerator.go
Signals: N/A
Excerpt (<=80 chars):  type TokenGenerator interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TokenGenerator
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/tokengenerator/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideTokenGenerator() TokenGenerator {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideTokenGenerator
```

--------------------------------------------------------------------------------

---[FILE: handler_branch.go]---
Location: harness-main/app/services/trigger/handler_branch.go
Signals: N/A
Excerpt (<=80 chars): func ExtractBranch(ref string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExtractBranch
- handleEventBranchCreated
- handleEventBranchUpdated
- augmentCommitInfo
```

--------------------------------------------------------------------------------

---[FILE: handler_pullreq.go]---
Location: harness-main/app/services/trigger/handler_pullreq.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleEventPullReqCreated(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleEventPullReqCreated
- handleEventPullReqReopened
- handleEventPullReqBranchUpdated
- handleEventPullReqClosed
- handleEventPullReqMerged
- augmentPullReqInfo
```

--------------------------------------------------------------------------------

---[FILE: handler_tag.go]---
Location: harness-main/app/services/trigger/handler_tag.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleEventTagCreated(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleEventTagCreated
- handleEventTagUpdated
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/trigger/service.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Prepare
- New
- trigger
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/trigger/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/app/services/usage/config.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- NewConfig
```

--------------------------------------------------------------------------------

---[FILE: event_handlers.go]---
Location: harness-main/app/services/usage/event_handlers.go
Signals: N/A
Excerpt (<=80 chars):  type RepoFinder interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepoFinder
- RegisterEventListeners
- repoCreateHandler
- repoPushHandler
- sendRepoPushUsage
```

--------------------------------------------------------------------------------

---[FILE: interface.go]---
Location: harness-main/app/services/usage/interface.go
Signals: N/A
Excerpt (<=80 chars):  type Sender interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Sender
```

--------------------------------------------------------------------------------

---[FILE: io.go]---
Location: harness-main/app/services/usage/io.go
Signals: N/A
Excerpt (<=80 chars):  type writeCounter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- writeCounter
- readCounter
- newWriter
- Write
- Header
- WriteHeader
- newReader
- Read
- Close
```

--------------------------------------------------------------------------------

---[FILE: io_test.go]---
Location: harness-main/app/services/usage/io_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_writeCounter_Write(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test_writeCounter_Write
- Test_readCounter_Read
```

--------------------------------------------------------------------------------

---[FILE: middleware.go]---
Location: harness-main/app/services/usage/middleware.go
Signals: N/A
Excerpt (<=80 chars):  func Middleware(intf Sender) func(http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Middleware
```

--------------------------------------------------------------------------------

---[FILE: middleware_int_test.go]---
Location: harness-main/app/services/usage/middleware_int_test.go
Signals: N/A
Excerpt (<=80 chars): func generateRandomData(size int) []byte {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateRandomData
- simulateUploadRequest
- simulateDownloadRequest
- uploadHandler
- downloadHandler
- TestUploadDownloadMiddleware
- waitServer
```

--------------------------------------------------------------------------------

---[FILE: middleware_test.go]---
Location: harness-main/app/services/usage/middleware_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestMiddleware(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestMiddleware
- testRequest
```

--------------------------------------------------------------------------------

---[FILE: mocks.go]---
Location: harness-main/app/services/usage/mocks.go
Signals: N/A
Excerpt (<=80 chars):  type mockInterface struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockInterface
- SpaceFinderMock
- RepoFinderMock
- MetricsMock
- Send
- FindByRef
- FindByID
- GetMetrics
- UpsertOptimistic
- List
```

--------------------------------------------------------------------------------

---[FILE: queue.go]---
Location: harness-main/app/services/usage/queue.go
Signals: N/A
Excerpt (<=80 chars):  type queue struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- queue
- newQueue
- Add
- Pop
- Close
- Len
```

--------------------------------------------------------------------------------

---[FILE: usage.go]---
Location: harness-main/app/services/usage/usage.go
Signals: N/A
Excerpt (<=80 chars):  type Bandwidth struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Bandwidth
- Metric
- SpaceFinder
- MetricStore
- Mediator
- worker
- Noop
- NewMediator
- Start
- Stop
- Send
- Wait
- Size
- process
- newWorker
```

--------------------------------------------------------------------------------

---[FILE: usage_test.go]---
Location: harness-main/app/services/usage/usage_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestMediator_basic(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestMediator_basic
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/usage/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideMediator(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideMediator
```

--------------------------------------------------------------------------------

---[FILE: resolver.go]---
Location: harness-main/app/services/usergroup/resolver.go
Signals: N/A
Excerpt (<=80 chars):  type GitnessResolver struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitnessResolver
- NewGitnessResolver
- Resolve
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/usergroup/service.go
Signals: N/A
Excerpt (<=80 chars):  type service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- List
- ListUserIDsByGroupIDs
- MapGroupIDsToPrincipals
```

--------------------------------------------------------------------------------

---[FILE: user_group_resolver.go]---
Location: harness-main/app/services/usergroup/user_group_resolver.go
Signals: N/A
Excerpt (<=80 chars):  type Resolver interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resolver
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/usergroup/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideUserGroupResolver() Resolver {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideUserGroupResolver
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/app/services/webhook/common.go
Signals: N/A
Excerpt (<=80 chars): func CheckURL(rawURL string, allowLoopback bool, allowPrivateNetwork bool, in...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckURL
- CheckSecret
- CheckTriggers
- CheckExtraHeaders
- DeduplicateTriggers
- ConvertTriggers
- shouldAuditWebhook
- getWebhookAuditInfo
- sendSSE
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/services/webhook/create.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) sanitizeCreateInput(in *types.WebhookCreateInput, internal...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeCreateInput
- Create
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/services/webhook/delete.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) Delete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Delete
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/services/webhook/events.go
Signals: N/A
Excerpt (<=80 chars):  func generateTriggerIDFromEventID(eventID string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateTriggerIDFromEventID
- triggerForEventWithRepo
- triggerForEventWithPullReq
- findRepositoryForEvent
- findPullReqForEvent
- FindPrincipalForEvent
- TriggerForEvent
```

--------------------------------------------------------------------------------

---[FILE: execution.go]---
Location: harness-main/app/services/webhook/execution.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) FindExecution(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindExecution
- ListExecutions
- RetriggerExecution
```

--------------------------------------------------------------------------------

---[FILE: handler_branch.go]---
Location: harness-main/app/services/webhook/handler_branch.go
Signals: N/A
Excerpt (<=80 chars): type ReferencePayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReferencePayload
- handleEventBranchCreated
- handleEventBranchUpdated
- handleEventBranchDeleted
- fetchCommitInfoForEvent
- fetchCommitsInfoForEvent
```

--------------------------------------------------------------------------------

---[FILE: handler_pullreq.go]---
Location: harness-main/app/services/webhook/handler_pullreq.go
Signals: N/A
Excerpt (<=80 chars): type PullReqCreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqCreatedPayload
- PullReqBranchUpdatedPayload
- PullReqClosedPayload
- PullReqMergedPayload
- PullReqCommentPayload
- PullReqLabelAssignedPayload
- PullReqUpdatedPayload
- PullReqActivityStatusUpdatedPayload
- PullReqReviewSubmittedPayload
- PullReqTargetBranchChangedPayload
- handleEventPullReqCreated
- handleEventPullReqReopened
- handleEventPullReqBranchUpdated
- handleEventPullReqClosed
- handleEventPullReqMerged
- handleEventPullReqComment
- handleEventPullReqCommentUpdated
- extractCodeCommentInfoIfAvailable
```

--------------------------------------------------------------------------------

---[FILE: handler_tag.go]---
Location: harness-main/app/services/webhook/handler_tag.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) handleEventTagCreated(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleEventTagCreated
- handleEventTagUpdated
- handleEventTagDeleted
```

--------------------------------------------------------------------------------

---[FILE: http_client.go]---
Location: harness-main/app/services/webhook/http_client.go
Signals: N/A
Excerpt (<=80 chars):  func newHTTPClient(allowLoopback bool, allowPrivateNetwork bool, disableSSLV...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newHTTPClient
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/services/webhook/list.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
- getParentInfoRepo
- getParentInfoSpace
```

--------------------------------------------------------------------------------

---[FILE: ownership.go]---
Location: harness-main/app/services/webhook/ownership.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
- GetWebhookVerifyOwnership
- GetWebhookExecutionVerifyOwnership
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/webhook/service.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- WebhookExecutorStore
- WebhookExecutor
- Prepare
- NewWebhookExecutor
- NewService
```

--------------------------------------------------------------------------------

---[FILE: store.go]---
Location: harness-main/app/services/webhook/store.go
Signals: N/A
Excerpt (<=80 chars):  type GitnessWebhookExecutorStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitnessWebhookExecutorStore
- Find
- ListWebhooks
- ListForTrigger
- CreateWebhookExecution
- UpdateOptLock
- FindWebhook
```

--------------------------------------------------------------------------------

---[FILE: trigger.go]---
Location: harness-main/app/services/webhook/trigger.go
Signals: N/A
Excerpt (<=80 chars):  type TriggerResult struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TriggerResult
- Skipped
- triggerWebhooksFor
- triggerWebhooks
- RetriggerWebhookExecution
- executeWebhook
- prepareHTTPRequest
- toXHeader
- handleWebhookResponse
- getSecretValue
- CoreWebhookExecutionToGitnessWebhookExecution
- GitnessWebhookExecutionToWebhookExecutionCore
- GitnessWebhookToWebhookCore
- CoreWebhookToGitnessWebhook
- GitnessWebhooksToWebhooksCore
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/app/services/webhook/types.go
Signals: N/A
Excerpt (<=80 chars): type BaseSegment struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseSegment
- ReferenceSegment
- ReferenceDetailsSegment
- ReferenceUpdateSegment
- PullReqTargetReferenceSegment
- PullReqSegment
- PullReqCommentSegment
- PullReqCommentStatusUpdatedSegment
- PullReqLabelSegment
- PullReqUpdateSegment
- PullReqReviewSegment
- PullReqTargetBrancheChangedSegment
- RepositoryInfo
- PullReqInfo
- PrincipalInfo
- CommitInfo
- SignatureInfo
- IdentityInfo
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/services/webhook/update.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) sanitizeUpdateInput(in *types.WebhookUpdateInput) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeUpdateInput
- Update
```

--------------------------------------------------------------------------------

---[FILE: url_provider.go]---
Location: harness-main/app/services/webhook/url_provider.go
Signals: N/A
Excerpt (<=80 chars):  type GitnessURLProvider struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitnessURLProvider
- NewURLProvider
- GetWebhookURL
```

--------------------------------------------------------------------------------

---[FILE: url_provider_interface.go]---
Location: harness-main/app/services/webhook/url_provider_interface.go
Signals: N/A
Excerpt (<=80 chars):  type URLProvider interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- URLProvider
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/webhook/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
- ProvideURLProvider
```

--------------------------------------------------------------------------------

---[FILE: sse.go]---
Location: harness-main/app/sse/sse.go
Signals: N/A
Excerpt (<=80 chars): type Event struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Event
- Streamer
- pubsubStreamer
- NewStreamer
- Publish
- Stream
- getSpaceTopic
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/sse/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideEventsStreaming(pubsub pubsub.PubSub) Streamer {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideEventsStreaming
```

--------------------------------------------------------------------------------

---[FILE: logs.go]---
Location: harness-main/app/store/logs.go
Signals: N/A
Excerpt (<=80 chars): type LogStore interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogStore
```

--------------------------------------------------------------------------------

---[FILE: transformation.go]---
Location: harness-main/app/store/transformation.go
Signals: N/A
Excerpt (<=80 chars): type PrincipalUIDTransformation func(uid string) (string, error)

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToLowerPrincipalUIDTransformation
- ToLowerSpacePathTransformation
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/store/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvidePathTransformation() SpacePathTransformation {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvidePathTransformation
- ProvidePrincipalUIDTransformation
```

--------------------------------------------------------------------------------

---[FILE: evictor.go]---
Location: harness-main/app/store/cache/evictor.go
Signals: N/A
Excerpt (<=80 chars):  type Evictor[T any] struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Subscribe
- Evict
```

--------------------------------------------------------------------------------

---[FILE: repo_id.go]---
Location: harness-main/app/store/cache/repo_id.go
Signals: N/A
Excerpt (<=80 chars):  func NewRepoIDCache(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- repoIDCacheGetter
- NewRepoIDCache
- Find
```

--------------------------------------------------------------------------------

---[FILE: repo_ref.go]---
Location: harness-main/app/store/cache/repo_ref.go
Signals: N/A
Excerpt (<=80 chars):  func NewRepoRefCache(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- repoCacheGetter
- NewRepoRefCache
- Find
```

--------------------------------------------------------------------------------

---[FILE: space_id.go]---
Location: harness-main/app/store/cache/space_id.go
Signals: N/A
Excerpt (<=80 chars):  func NewSpaceIDCache(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- spaceIDCacheGetter
- NewSpaceIDCache
- Find
```

--------------------------------------------------------------------------------

---[FILE: space_path.go]---
Location: harness-main/app/store/cache/space_path.go
Signals: N/A
Excerpt (<=80 chars): type pathCacheGetter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pathCacheGetter
- spacePathCache
- New
- Find
- Get
- Stats
- Evict
```

--------------------------------------------------------------------------------

````
