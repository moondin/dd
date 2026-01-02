---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 15
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 15 of 37)

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

---[FILE: create.go]---
Location: harness-main/cli/operations/users/create.go
Signals: N/A
Excerpt (<=80 chars):  type createCommand struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createCommand
- run
- registerCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/cli/operations/users/delete.go
Signals: N/A
Excerpt (<=80 chars):  type deleteCommand struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- deleteCommand
- run
- registerDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/cli/operations/users/find.go
Signals: N/A
Excerpt (<=80 chars):  type findCommand struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findCommand
- run
- registerFind
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/cli/operations/users/list.go
Signals: N/A
Excerpt (<=80 chars):  type listCommand struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- listCommand
- run
- registerList
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/cli/operations/users/update.go
Signals: N/A
Excerpt (<=80 chars):  type updateCommand struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateCommand
- run
- registerUpdate
```

--------------------------------------------------------------------------------

---[FILE: users.go]---
Location: harness-main/cli/operations/users/users.go
Signals: N/A
Excerpt (<=80 chars): func Register(app *kingpin.Application) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Register
```

--------------------------------------------------------------------------------

---[FILE: provider.go]---
Location: harness-main/cli/provide/provider.go
Signals: N/A
Excerpt (<=80 chars):  func NewSession() session.Session {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewSession
- Session
- Client
- OpenClient
- sessionPath
- loadSession
- newClient
```

--------------------------------------------------------------------------------

---[FILE: session.go]---
Location: harness-main/cli/session/session.go
Signals: N/A
Excerpt (<=80 chars):  type Session struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Session
- New
- LoadFromPath
- Store
- SetURI
- SetExpiresAt
- SetAccessToken
- Path
```

--------------------------------------------------------------------------------

---[FILE: input.go]---
Location: harness-main/cli/textui/input.go
Signals: N/A
Excerpt (<=80 chars): func Registration() (string, string, string, string) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registration
- Credentials
- UserID
- LoginIdentifier
- DisplayName
- Email
- Password
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/client/client.go
Signals: N/A
Excerpt (<=80 chars): type HTTPClient struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HTTPClient
- New
- NewToken
- SetClient
- SetDebug
- Login
- Register
- Self
- UserCreatePAT
- User
- UserList
- UserCreate
- UserUpdate
- UserDelete
- get
- post
- patch
- delete
```

--------------------------------------------------------------------------------

---[FILE: interface.go]---
Location: harness-main/client/interface.go
Signals: N/A
Excerpt (<=80 chars): type Client interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Client
- remoteError
- Error
```

--------------------------------------------------------------------------------

---[FILE: main.go]---
Location: harness-main/cmd/gitness/main.go
Signals: N/A
Excerpt (<=80 chars):  func main() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- main
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/cmd/gitness/wire.go
Signals: N/A
Excerpt (<=80 chars):  func initSystem(ctx context.Context, config *types.Config) (*cliserver.Syste...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initSystem
```

--------------------------------------------------------------------------------

---[FILE: wire_gen.go]---
Location: harness-main/cmd/gitness/wire_gen.go
Signals: N/A
Excerpt (<=80 chars):  func initSystem(ctx context.Context, config *types.Config) (*server.System, ...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initSystem
```

--------------------------------------------------------------------------------

---[FILE: contextutil.go]---
Location: harness-main/contextutil/contextutil.go
Signals: N/A
Excerpt (<=80 chars): func WithNewTimeout(ctx context.Context, timeout time.Duration) (context.Cont...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WithNewTimeout
```

--------------------------------------------------------------------------------

---[FILE: contextutil_test.go]---
Location: harness-main/contextutil/contextutil_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestWithNewTimeout(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestWithNewTimeout
```

--------------------------------------------------------------------------------

---[FILE: crypto.go]---
Location: harness-main/crypto/crypto.go
Signals: N/A
Excerpt (<=80 chars): func GenerateHMACSHA256(data []byte, key []byte) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateHMACSHA256
- IsShaEqual
```

--------------------------------------------------------------------------------

---[FILE: crypto_test.go]---
Location: harness-main/crypto/crypto_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGenerateHMACSHA256(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGenerateHMACSHA256
- TestGenerateHMACSHA256Consistency
- TestGenerateHMACSHA256DifferentInputs
- TestIsShaEqual
- TestIsShaEqualTimingSafety
- TestGenerateHMACSHA256WithRealWorldData
- BenchmarkGenerateHMACSHA256
- BenchmarkGenerateHMACSHA256LargeData
- BenchmarkIsShaEqual
- BenchmarkIsShaEqualLarge
```

--------------------------------------------------------------------------------

---[FILE: aesgcm.go]---
Location: harness-main/encrypt/aesgcm.go
Signals: N/A
Excerpt (<=80 chars): type Aesgcm struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Aesgcm
- Encrypt
- Decrypt
- New
```

--------------------------------------------------------------------------------

---[FILE: aesgcm_test.go]---
Location: harness-main/encrypt/aesgcm_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNew(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNew
- TestAesgcmEncryptDecrypt
- TestAesgcmEncryptUniqueness
- TestAesgcmDecryptInvalidCiphertext
- TestAesgcmCompatMode
- TestAesgcmCompatModeShortCiphertext
- TestAesgcmNonCompatModeInvalidCiphertext
```

--------------------------------------------------------------------------------

---[FILE: encrypt.go]---
Location: harness-main/encrypt/encrypt.go
Signals: N/A
Excerpt (<=80 chars): type Encrypter interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Encrypter
```

--------------------------------------------------------------------------------

---[FILE: none.go]---
Location: harness-main/encrypt/none.go
Signals: N/A
Excerpt (<=80 chars): type none struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- none
- Encrypt
- Decrypt
```

--------------------------------------------------------------------------------

---[FILE: none_test.go]---
Location: harness-main/encrypt/none_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNone_Encrypt(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNone_Encrypt
- TestNone_Decrypt
- TestNone_EncryptDecrypt_RoundTrip
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/encrypt/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideEncrypter(config *types.Config) (Encrypter, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideEncrypter
```

--------------------------------------------------------------------------------

---[FILE: status.go]---
Location: harness-main/errors/status.go
Signals: N/A
Excerpt (<=80 chars):  type Status string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Error
- SetErr
- SetDetails
- Unwrap
- AsStatus
- Message
- Details
- AsError
- Format
- NotFound
- NotFoundf
- InvalidArgument
- InvalidArgumentf
- Internal
- Internalf
- Conflict
- Conflictf
```

--------------------------------------------------------------------------------

---[FILE: status_test.go]---
Location: harness-main/errors/status_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestStatusConstants(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestStatusConstants
- TestErrorStruct
- TestErrorWithoutUnderlyingError
- TestErrorSetErr
- TestErrorSetDetails
- TestAsStatus
- TestMessage
- TestDetails
- TestAsError
- TestFormat
- TestHelperFunctions
- TestInternal
- TestStatusCheckFunctions
- TestStatusCheckFunctionsWithStandardError
- TestStatusCheckFunctionsWithNil
- mapsEqual
- BenchmarkErrorError
- BenchmarkAsStatus
```

--------------------------------------------------------------------------------

---[FILE: stderr.go]---
Location: harness-main/errors/stderr.go
Signals: N/A
Excerpt (<=80 chars):  func New(text string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- New
- Is
- As
```

--------------------------------------------------------------------------------

---[FILE: stderr_test.go]---
Location: harness-main/errors/stderr_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNew(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- customError
- anotherError
- codeError
- TestNew
- TestNewComparison
- TestIs
- Error
- TestAs
- TestAsWithValues
- BenchmarkNew
- BenchmarkIs
- BenchmarkAs
```

--------------------------------------------------------------------------------

---[FILE: util_test.go]---
Location: harness-main/errors/util_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestIsType(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- testValueError
- TestIsType
- TestIsTypeWithNil
- TestIsTypeWithWrappedErrors
- TestIsTypeWithCustomError
- TestIsTypeWithMultipleWrapping
- TestIsTypeWithDifferentErrorTypes
- TestIsTypeEdgeCases
- TestIsTypePerformance
- Error
- BenchmarkIsTypeValueError
- BenchmarkIsTypeCustomError
- BenchmarkIsTypeStandardError
- BenchmarkIsTypeWrappedError
```

--------------------------------------------------------------------------------

---[FILE: error.go]---
Location: harness-main/events/error.go
Signals: N/A
Excerpt (<=80 chars): type discardEventError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- discardEventError
- NewDiscardEventError
- NewDiscardEventErrorf
- Error
- Unwrap
- Is
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/events/events.go
Signals: N/A
Excerpt (<=80 chars):  type Event[T any] struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- getStreamID
- Validate
```

--------------------------------------------------------------------------------

---[FILE: options.go]---
Location: harness-main/events/options.go
Signals: N/A
Excerpt (<=80 chars): type ReaderOption stream.ConsumerOption

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toStreamConsumerOptions
- WithConcurrency
- WithHandlerOptions
- toStreamHandlerOptions
- WithMaxRetries
- WithIdleTimeout
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/events/reader.go
Signals: N/A
Excerpt (<=80 chars): type ReaderFactoryFunc[R Reader] func(reader *GenericReader) (R, error)

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReaderCanceler
- Reader
- GenericReader
- Launch
- Cancel
- Configure
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/events/reporter.go
Signals: N/A
Excerpt (<=80 chars): type GenericReporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericReporter
```

--------------------------------------------------------------------------------

---[FILE: stream.go]---
Location: harness-main/events/stream.go
Signals: N/A
Excerpt (<=80 chars): type StreamProducer interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StreamProducer
- StreamConsumer
```

--------------------------------------------------------------------------------

---[FILE: system.go]---
Location: harness-main/events/system.go
Signals: N/A
Excerpt (<=80 chars): type System struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- System
- NewSystem
- NewReporter
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/events/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideSystem(config Config, redisClient redis.UniversalClient) (*Syste...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideSystem
- provideSystemInMemory
- provideSystemRedis
- newMemoryStreamConsumerFactoryMethod
- newMemoryStreamProducer
- newRedisStreamConsumerFactoryMethod
- newRedisStreamProducer
```

--------------------------------------------------------------------------------

---[FILE: blame.go]---
Location: harness-main/git/blame.go
Signals: N/A
Excerpt (<=80 chars):  type BlameParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlameParams
- BlamePart
- BlamePartPrevious
- Validate
- Blame
```

--------------------------------------------------------------------------------

---[FILE: blob.go]---
Location: harness-main/git/blob.go
Signals: N/A
Excerpt (<=80 chars):  type GetBlobParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetBlobParams
- GetBlobOutput
- GetBlob
- FindLFSPointers
```

--------------------------------------------------------------------------------

---[FILE: branch.go]---
Location: harness-main/git/branch.go
Signals: N/A
Excerpt (<=80 chars):  type BranchSortOption int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Branch
- CreateBranchParams
- CreateBranchOutput
- GetBranchParams
- GetBranchOutput
- DeleteBranchParams
- ListBranchesParams
- ListBranchesOutput
- CreateBranch
- GetBranch
- DeleteBranch
- ListBranches
- listBranchesLoadReferenceData
- listBranchesWalkReferencesHandler
```

--------------------------------------------------------------------------------

---[FILE: commit.go]---
Location: harness-main/git/commit.go
Signals: N/A
Excerpt (<=80 chars):  func CommitMessage(subject, body string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetCommitParams
- Commit
- GetCommitOutput
- Signature
- Identity
- ListCommitsParams
- RenameDetails
- ListCommitsOutput
- CommitFileStats
- GetCommitDivergencesParams
- GetCommitDivergencesOutput
- CommitDivergenceRequest
- CommitDivergence
- CommitMessage
- String
- Validate
- GetCommit
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/git/common.go
Signals: N/A
Excerpt (<=80 chars): type ReadParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReadParams
- WriteParams
- Validate
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/git/context.go
Signals: N/A
Excerpt (<=80 chars): type requestIDKey struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- requestIDKey
- RequestIDFrom
- WithRequestID
```

--------------------------------------------------------------------------------

---[FILE: diff.go]---
Location: harness-main/git/diff.go
Signals: N/A
Excerpt (<=80 chars):  type DiffParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiffParams
- DiffShortStatOutput
- DiffStatsOutput
- GetDiffHunkHeadersParams
- DiffFileHeader
- DiffFileHunkHeaders
- GetDiffHunkHeadersOutput
- DiffCutOutput
- DiffCutParams
- FileDiff
- DiffFileNamesOutput
- Validate
- RawDiff
- CommitDiff
- DiffShortStat
- DiffStats
- GetDiffHunkHeaders
```

--------------------------------------------------------------------------------

---[FILE: env.go]---
Location: harness-main/git/env.go
Signals: N/A
Excerpt (<=80 chars): func CreateEnvironmentForPush(ctx context.Context, writeRequest WriteParams) ...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateEnvironmentForPush
```

--------------------------------------------------------------------------------

---[FILE: hunk.go]---
Location: harness-main/git/hunk.go
Signals: N/A
Excerpt (<=80 chars):  type Hunk struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hunk
- HunkHeader
- IsZero
- IsValid
- String
```

--------------------------------------------------------------------------------

---[FILE: interface.go]---
Location: harness-main/git/interface.go
Signals: N/A
Excerpt (<=80 chars):  type Interface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Interface
```

--------------------------------------------------------------------------------

---[FILE: kuberesolver.go]---
Location: harness-main/git/kuberesolver.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: mapping.go]---
Location: harness-main/git/mapping.go
Signals: N/A
Excerpt (<=80 chars):  func mapBranch(b *api.Branch) (*Branch, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapBranch
- mapCommit
- mapFileStats
- mapSignature
- mapBranchesSortOption
- mapAnnotatedTag
- mapListCommitTagsSortOption
- mapTreeNode
- mapTreeNodeType
- mapTreeNodeMode
- mapRenameDetails
- mapToSortOrder
- mapHunkHeader
- mapDiffFileHeader
```

--------------------------------------------------------------------------------

---[FILE: match_files.go]---
Location: harness-main/git/match_files.go
Signals: N/A
Excerpt (<=80 chars):  type MatchFilesParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MatchFilesParams
- MatchFilesOutput
- MatchFiles
```

--------------------------------------------------------------------------------

---[FILE: merge.go]---
Location: harness-main/git/merge.go
Signals: N/A
Excerpt (<=80 chars): type MergeParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeParams
- RefUpdate
- MergeOutput
- MergeBaseParams
- MergeBaseOutput
- IsAncestorParams
- IsAncestorOutput
- Validate
- Merge
- MergeBase
- IsAncestor
```

--------------------------------------------------------------------------------

---[FILE: operations.go]---
Location: harness-main/git/operations.go
Signals: N/A
Excerpt (<=80 chars):  type FileAction string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommitFileAction
- CommitFilesParams
- FileReference
- CommitFilesResponse
- Enum
- Validate
- CommitFiles
- prepareTree
- prepareTreeEmptyRepo
- validateAndPrepareCommitFilesHeader
- processAction
```

--------------------------------------------------------------------------------

---[FILE: optimize.go]---
Location: harness-main/git/optimize.go
Signals: N/A
Excerpt (<=80 chars):  type OptimizeRepoStrategy int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OptimizeRepositoryParams
- OptimizationStrategy
- HeuristicalOptimizationStrategy
- WriteCommitGraphParams
- PruneObjectsParams
- FullOptimizationStrategy
- Validate
- parseGCArgs
- OptimizeRepository
- NewHeuristicalOptimizationStrategy
- ShouldRepackObjects
- ShouldWriteCommitGraph
- ShouldPruneObjects
- ShouldRepackReferences
- NewFullOptimizationStrategy
```

--------------------------------------------------------------------------------

---[FILE: optimize_test.go]---
Location: harness-main/git/optimize_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseGCArgs(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestParseGCArgs
```

--------------------------------------------------------------------------------

---[FILE: params.go]---
Location: harness-main/git/params.go
Signals: N/A
Excerpt (<=80 chars):  type Repository interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Repository
- CreateReadParams
```

--------------------------------------------------------------------------------

---[FILE: path.go]---
Location: harness-main/git/path.go
Signals: N/A
Excerpt (<=80 chars): func getFullPathForRepo(reposRoot, uid string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFullPathForRepo
```

--------------------------------------------------------------------------------

---[FILE: pipeline.go]---
Location: harness-main/git/pipeline.go
Signals: N/A
Excerpt (<=80 chars):  type GeneratePipelineParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GeneratePipelineParams
- GeneratePipelinesOutput
- GeneratePipeline
```

--------------------------------------------------------------------------------

---[FILE: pre_receive_pre_processor.go]---
Location: harness-main/git/pre_receive_pre_processor.go
Signals: N/A
Excerpt (<=80 chars):  type FindOversizeFilesParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindOversizeFilesParams
- FileInfo
- FindOversizeFilesOutput
- FindCommitterMismatchParams
- CommitInfo
- FindCommitterMismatchOutput
- FindLFSPointersParams
- LFSInfo
- FindLFSPointersOutput
- ProcessPreReceiveObjectsParams
- ProcessPreReceiveObjectsOutput
- ProcessPreReceiveObjects
- findOversizeFiles
- findCommitterMismatch
- findLFSPointers
```

--------------------------------------------------------------------------------

---[FILE: push_remote.go]---
Location: harness-main/git/push_remote.go
Signals: N/A
Excerpt (<=80 chars):  type PushRemoteParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushRemoteParams
- Validate
- PushRemote
```

--------------------------------------------------------------------------------

---[FILE: ref.go]---
Location: harness-main/git/ref.go
Signals: N/A
Excerpt (<=80 chars):  type GetRefParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRefParams
- GetRefResponse
- UpdateRefParams
- Validate
- GetRef
- UpdateRef
- GetRefPath
- wrapInstructorWithOptionalPagination
- createReferenceWalkPatternsFromQuery
- sanitizeReferenceQuery
```

--------------------------------------------------------------------------------

---[FILE: repack.go]---
Location: harness-main/git/repack.go
Signals: N/A
Excerpt (<=80 chars):  type RepackStrategy string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepackParams
- Validate
- repackObjects
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/git/repo.go
Signals: N/A
Excerpt (<=80 chars):  type CreateRepositoryParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRepositoryParams
- CreateRepositoryOutput
- DeleteRepositoryParams
- GetRepositorySizeParams
- GetRepositorySizeOutput
- SyncRepositoryParams
- SyncRepositoryOutput
- HashRepositoryParams
- HashRepositoryOutput
- UpdateDefaultBranchParams
- GetDefaultBranchParams
- GetDefaultBranchOutput
- ArchiveParams
- FetchObjectsParams
- FetchObjectsOutput
- GetRemoteDefaultBranchParams
- GetRemoteDefaultBranchOutput
- SyncRefsParams
```

--------------------------------------------------------------------------------

---[FILE: revert.go]---
Location: harness-main/git/revert.go
Signals: N/A
Excerpt (<=80 chars): type RevertParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevertParams
- RevertOutput
- Validate
- Revert
```

--------------------------------------------------------------------------------

---[FILE: revision.go]---
Location: harness-main/git/revision.go
Signals: N/A
Excerpt (<=80 chars):  type ResolveRevisionParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolveRevisionParams
- ResolveRevisionOutput
- ResolveRevision
```

--------------------------------------------------------------------------------

---[FILE: scan_secrets.go]---
Location: harness-main/git/scan_secrets.go
Signals: N/A
Excerpt (<=80 chars):  type ScanSecretsParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScanSecretsParams
- ScanSecretsOutput
- ScanSecretsFinding
- ScanSecrets
- setupGitleaksIgnoreInSharedRepo
- mapFindings
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/git/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- New
- createSubdir
```

--------------------------------------------------------------------------------

---[FILE: service_pack.go]---
Location: harness-main/git/service_pack.go
Signals: N/A
Excerpt (<=80 chars):  type InfoRefsParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfoRefsParams
- ServicePackParams
- GetInfoRefs
- Validate
- ServicePack
```

--------------------------------------------------------------------------------

---[FILE: signed_data.go]---
Location: harness-main/git/signed_data.go
Signals: N/A
Excerpt (<=80 chars): type SignedData struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SignedData
```

--------------------------------------------------------------------------------

---[FILE: stream.go]---
Location: harness-main/git/stream.go
Signals: N/A
Excerpt (<=80 chars): type StreamReader[T any] struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Next
```

--------------------------------------------------------------------------------

---[FILE: submodule.go]---
Location: harness-main/git/submodule.go
Signals: N/A
Excerpt (<=80 chars):  type GetSubmoduleParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetSubmoduleParams
- GetSubmoduleOutput
- GetSubmodule
```

--------------------------------------------------------------------------------

---[FILE: summary.go]---
Location: harness-main/git/summary.go
Signals: N/A
Excerpt (<=80 chars):  type SummaryParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SummaryParams
- SummaryOutput
- Summary
```

--------------------------------------------------------------------------------

---[FILE: tag.go]---
Location: harness-main/git/tag.go
Signals: N/A
Excerpt (<=80 chars):  type TagSortOption int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListCommitTagsParams
- ListCommitTagsOutput
- CommitTag
- CreateCommitTagParams
- CreateCommitTagOutput
- DeleteTagParams
- Validate
- ListCommitTags
- CreateCommitTag
- DeleteTag
- listCommitTagsLoadReferenceData
- listCommitTagsWalkReferencesHandler
- newInstructorWithObjectTypeFilter
```

--------------------------------------------------------------------------------

---[FILE: tree.go]---
Location: harness-main/git/tree.go
Signals: N/A
Excerpt (<=80 chars): type TreeNodeType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TreeNode
- ListTreeNodeParams
- ListTreeNodeOutput
- GetTreeNodeParams
- GetTreeNodeOutput
- ListPathsParams
- ListPathsOutput
- PathsDetailsParams
- PathsDetailsOutput
- PathDetails
- GetTreeNode
- ListTreeNodes
- ListPaths
- PathsDetails
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/git/upload.go
Signals: N/A
Excerpt (<=80 chars):  type File struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- File
- addFilesAndPush
- handleFileUploadIfAvailable
```

--------------------------------------------------------------------------------

---[FILE: validate.go]---
Location: harness-main/git/validate.go
Signals: N/A
Excerpt (<=80 chars):  func ValidateCommitSHA(commitSHA string) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateCommitSHA
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/git/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideGITAdapter(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideGITAdapter
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: api.go]---
Location: harness-main/git/api/api.go
Signals: N/A
Excerpt (<=80 chars):  type Git struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Git
- New
```

--------------------------------------------------------------------------------

---[FILE: archive.go]---
Location: harness-main/git/api/archive.go
Signals: N/A
Excerpt (<=80 chars):  type ArchiveFormat string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArchiveParams
- ParseArchiveFormat
- Validate
- Archive
```

--------------------------------------------------------------------------------

---[FILE: blame.go]---
Location: harness-main/git/api/blame.go
Signals: N/A
Excerpt (<=80 chars):  type BlamePart struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlamePart
- BlamePartPrevious
- BlameNextReader
- blameReaderCacheItem
- BlameReader
- Blame
- nextLine
- unreadLine
- NextPart
- parseBlameHeaders
- extractName
- extractPrevious
- extractEmail
- extractTime
```

--------------------------------------------------------------------------------

---[FILE: blame_test.go]---
Location: harness-main/git/api/blame_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestBlameReader_NextPart(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestBlameReader_NextPart
- TestBlameReader_NextPart_UserError
- TestBlameReader_NextPart_CmdError
```

--------------------------------------------------------------------------------

---[FILE: blob.go]---
Location: harness-main/git/api/blob.go
Signals: N/A
Excerpt (<=80 chars):  type BlobReader struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlobReader
- limitReaderCloser
- GetBlob
- newLimitReaderCloser
- Read
- Close
```

--------------------------------------------------------------------------------

---[FILE: branch.go]---
Location: harness-main/git/api/branch.go
Signals: N/A
Excerpt (<=80 chars):  type Branch struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Branch
- BranchFilter
- EnsureBranchPrefix
- GetBranch
- HasBranches
- IsBranchExist
- GetBranchCount
- countLines
```

--------------------------------------------------------------------------------

---[FILE: cat-file.go]---
Location: harness-main/git/api/cat-file.go
Signals: N/A
Excerpt (<=80 chars): type WriteCloserError interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WriteCloserError
- BatchHeaderResponse
- CatFileBatch
- ReadBatchHeaderLine
- catFileObjects
- CatFileCommits
- CatFileAnnotatedTag
- CatFileAnnotatedTagFromSHAs
- catFileAnnotatedTags
- asCommit
- asTag
```

--------------------------------------------------------------------------------

---[FILE: commit.go]---
Location: harness-main/git/api/commit.go
Signals: N/A
Excerpt (<=80 chars):  type CommitChangesOptions struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommitChangesOptions
- CommitFileStats
- Commit
- CommitFilter
- CommitDivergenceRequest
- CommitDivergence
- PathRenameDetails
- changeInfoType
- changeInfoChange
- listCommitSHAs
- ListCommits
- getCommitFileStats
- cleanupCommitsForRename
- getRenameDetails
- gitGetRenameDetails
- gitLogNameStatus
- gitShowNumstat
```

--------------------------------------------------------------------------------

---[FILE: commit_graph.go]---
Location: harness-main/git/api/commit_graph.go
Signals: N/A
Excerpt (<=80 chars):  type CommitGraphAction string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommitGraphParams
- Validate
- String
- CommitGraph
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/git/api/config.go
Signals: N/A
Excerpt (<=80 chars): func (g *Git) Config(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: diff.go]---
Location: harness-main/git/api/diff.go
Signals: N/A
Excerpt (<=80 chars):  type FileDiffRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileDiffRequest
- DiffShortStat
- modifyHeader
- cutLinesFromFullFileDiff
- RawDiff
- CommitDiff
- GetDiffHunkHeaders
- DiffCut
- diffCutFromHunk
- diffCutFromBlob
- DiffFileName
- GetDiffShortStat
- parseDiffStat
- parseDiffStderr
```

--------------------------------------------------------------------------------

---[FILE: diff_test.go]---
Location: harness-main/git/api/diff_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_modifyHeader(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- args
- Test_modifyHeader
- Test_cutLinesFromFullDiff
```

--------------------------------------------------------------------------------

---[FILE: errors.go]---
Location: harness-main/git/api/errors.go
Signals: N/A
Excerpt (<=80 chars): type PushOutOfDateError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushOutOfDateError
- PushRejectedError
- MoreThanOneError
- UnrelatedHistoriesError
- Error
- Unwrap
- IsErrPushRejected
- GenerateMessage
- IsErrMoreThanOne
- processGitErrorf
- Map
- Is
- IsUnrelatedHistoriesError
- AsUnrelatedHistoriesError
```

--------------------------------------------------------------------------------

---[FILE: files.go]---
Location: harness-main/git/api/files.go
Signals: N/A
Excerpt (<=80 chars): func CleanUploadFileName(name string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CleanUploadFileName
```

--------------------------------------------------------------------------------

---[FILE: fs.go]---
Location: harness-main/git/api/fs.go
Signals: N/A
Excerpt (<=80 chars): type FS struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FS
- fsDir
- fsFile
- fsEntry
- NewFS
- Open
- openBlob
- openSubmodule
- openTree
- ReadFile
- ReadDir
- Glob
- Stat
- Read
- Close
- Name
```

--------------------------------------------------------------------------------

---[FILE: gc.go]---
Location: harness-main/git/api/gc.go
Signals: N/A
Excerpt (<=80 chars):  type GCParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GCParams
- GC
```

--------------------------------------------------------------------------------

---[FILE: info.go]---
Location: harness-main/git/api/info.go
Signals: N/A
Excerpt (<=80 chars): type RepositoryInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryInfo
- LooseObjectsInfo
- PackFilesInfo
- BitmapInfo
- MultiPackIndexInfo
- ReferencesInfo
- CommitGraphInfo
- LoadRepositoryInfo
- LoadLooseObjectsInfo
- isValidLooseObjectName
- LoadPackFilesInfo
- SetLastFullRepackTime
- GetLastFullRepackTime
- hasPrefixAndSuffix
- LoadBitmapInfo
- LoadMultiPackIndexInfo
- LoadReferencesInfo
- LoadCommitGraphInfo
```

--------------------------------------------------------------------------------

---[FILE: last_commit_cache.go]---
Location: harness-main/git/api/last_commit_cache.go
Signals: N/A
Excerpt (<=80 chars):  func NewInMemoryLastCommitCache(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commitValueCodec
- commitEntryGetter
- NewInMemoryLastCommitCache
- logCacheErrFn
- NewRedisLastCommitCache
- NoLastCommitCache
- makeCommitEntryKey
- Split
- Encode
- Decode
- Find
```

--------------------------------------------------------------------------------

---[FILE: mapping.go]---
Location: harness-main/git/api/mapping.go
Signals: N/A
Excerpt (<=80 chars):  func mapRawRef(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapRawRef
- mapToReferenceSortingArgument
```

--------------------------------------------------------------------------------

---[FILE: match_files.go]---
Location: harness-main/git/api/match_files.go
Signals: N/A
Excerpt (<=80 chars):  type FileContent struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileContent
- MatchFiles
```

--------------------------------------------------------------------------------

---[FILE: merge.go]---
Location: harness-main/git/api/merge.go
Signals: N/A
Excerpt (<=80 chars): func (g *Git) GetMergeBase(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetMergeBase
- IsAncestor
```

--------------------------------------------------------------------------------

---[FILE: object.go]---
Location: harness-main/git/api/object.go
Signals: N/A
Excerpt (<=80 chars):  type GitObjectType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseGitObjectType
- HashObject
```

--------------------------------------------------------------------------------

---[FILE: pack-objects.go]---
Location: harness-main/git/api/pack-objects.go
Signals: N/A
Excerpt (<=80 chars):  type PackObjectsParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackObjectsParams
- PackObjects
```

--------------------------------------------------------------------------------

---[FILE: paths_details.go]---
Location: harness-main/git/api/paths_details.go
Signals: N/A
Excerpt (<=80 chars):  type PathDetails struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PathDetails
- PathsDetails
```

--------------------------------------------------------------------------------

````
