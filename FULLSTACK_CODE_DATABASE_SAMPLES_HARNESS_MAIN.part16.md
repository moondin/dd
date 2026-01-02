---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 16
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 16 of 37)

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

---[FILE: prune.go]---
Location: harness-main/git/api/prune.go
Signals: N/A
Excerpt (<=80 chars):  type PrunePackedParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrunePackedParams
- PruneObjectsParams
- PrunePacked
- PruneObjects
```

--------------------------------------------------------------------------------

---[FILE: ref.go]---
Location: harness-main/git/api/ref.go
Signals: N/A
Excerpt (<=80 chars): type GitReferenceField string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WalkReferencesOptions
- ParseGitReferenceField
- DefaultInstructor
- WalkReferences
- walkReferenceParser
- GetRef
- GetReferenceFromBranchName
- GetReferenceFromTagName
```

--------------------------------------------------------------------------------

---[FILE: ref_pack.go]---
Location: harness-main/git/api/ref_pack.go
Signals: N/A
Excerpt (<=80 chars):  type PackRefsParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackRefsParams
- PackRefs
```

--------------------------------------------------------------------------------

---[FILE: repack.go]---
Location: harness-main/git/api/repack.go
Signals: N/A
Excerpt (<=80 chars):  type RepackParams struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepackParams
- RepackObjects
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/git/api/repo.go
Signals: N/A
Excerpt (<=80 chars):  type CloneRepoOptions struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CloneRepoOptions
- PushOptions
- ObjectCount
- InitRepository
- SetDefaultBranch
- GetDefaultBranch
- GetSymbolicRefHeadRaw
- GetRemoteDefaultBranch
- Clone
- Sync
- FetchObjects
- ListRemoteReferences
- ListLocalReferences
- AddFiles
- Commit
- Push
- CountObjects
- parseGitCountObjectsOutput
```

--------------------------------------------------------------------------------

---[FILE: rev.go]---
Location: harness-main/git/api/rev.go
Signals: N/A
Excerpt (<=80 chars):  func (g *Git) ResolveRev(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolveRev
```

--------------------------------------------------------------------------------

---[FILE: service_pack.go]---
Location: harness-main/git/api/service_pack.go
Signals: N/A
Excerpt (<=80 chars):  func (g *Git) InfoRefs(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServicePackConfig
- ServicePackOptions
- InfoRefs
- ServicePack
- packetWrite
- PktError
```

--------------------------------------------------------------------------------

---[FILE: signature.go]---
Location: harness-main/git/api/signature.go
Signals: N/A
Excerpt (<=80 chars): type Signature struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Signature
- Identity
- String
- Validate
```

--------------------------------------------------------------------------------

---[FILE: signed_data.go]---
Location: harness-main/git/api/signed_data.go
Signals: N/A
Excerpt (<=80 chars): type SignedData struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SignedData
```

--------------------------------------------------------------------------------

---[FILE: submodule.go]---
Location: harness-main/git/api/submodule.go
Signals: N/A
Excerpt (<=80 chars):  type Submodule struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetSubmodule
- GetSubModules
```

--------------------------------------------------------------------------------

---[FILE: tag.go]---
Location: harness-main/git/api/tag.go
Signals: N/A
Excerpt (<=80 chars):  type Tag struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tag
- CreateTagOptions
- GetAnnotatedTag
- GetAnnotatedTags
- CreateTag
- GetTagCount
```

--------------------------------------------------------------------------------

---[FILE: tree.go]---
Location: harness-main/git/api/tree.go
Signals: N/A
Excerpt (<=80 chars):  type TreeNodeWithCommit struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TreeNodeWithCommit
- TreeNode
- IsExecutable
- IsDir
- IsLink
- IsSubmodule
- String
- cleanTreePath
- parseTreeNodeMode
- lsTree
- lsDirectory
- lsFile
- flattenDirectory
- GetTreeNode
- ListTreeNodes
- ListTreeNodesRecursive
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/git/api/util.go
Signals: N/A
Excerpt (<=80 chars): func SanitizeCredentialURLs(s string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SanitizeCredentialURLs
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/git/api/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideLastCommitCache(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideLastCommitCache
```

--------------------------------------------------------------------------------

---[FILE: format.go]---
Location: harness-main/git/api/foreachref/format.go
Signals: N/A
Excerpt (<=80 chars): type Format struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Format
- NewFormat
- Flag
- Parser
- hexEscaped
```

--------------------------------------------------------------------------------

---[FILE: parser.go]---
Location: harness-main/git/api/foreachref/parser.go
Signals: N/A
Excerpt (<=80 chars): type Parser struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Parser
- NewParser
- Next
- Err
- parseRef
```

--------------------------------------------------------------------------------

---[FILE: branch.go]---
Location: harness-main/git/check/branch.go
Signals: N/A
Excerpt (<=80 chars): func BranchName(branch string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BranchName
```

--------------------------------------------------------------------------------

---[FILE: branch_test.go]---
Location: harness-main/git/check/branch_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestBranchName(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- args
- TestBranchName
```

--------------------------------------------------------------------------------

---[FILE: builder.go]---
Location: harness-main/git/command/builder.go
Signals: N/A
Excerpt (<=80 chars):  type builder struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- builder
- supportsEndOfOptions
- args
- validatePositionalArg
- threadsConfigValue
- configurePackOptions
```

--------------------------------------------------------------------------------

---[FILE: command.go]---
Location: harness-main/git/command/command.go
Signals: N/A
Excerpt (<=80 chars): type Command struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Command
- New
- Clone
- Add
- Run
- makeArgs
```

--------------------------------------------------------------------------------

---[FILE: command_test.go]---
Location: harness-main/git/command/command_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestCreateBareRepository(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCreateBareRepository
- TestCommandContextTimeout
```

--------------------------------------------------------------------------------

---[FILE: env.go]---
Location: harness-main/git/command/env.go
Signals: N/A
Excerpt (<=80 chars): type Envs map[string]string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Args
```

--------------------------------------------------------------------------------

---[FILE: env_test.go]---
Location: harness-main/git/command/env_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestEnvs_Args(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestEnvs_Args
```

--------------------------------------------------------------------------------

---[FILE: error.go]---
Location: harness-main/git/command/error.go
Signals: N/A
Excerpt (<=80 chars): type Error struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Error
- NewError
- ExitCode
- IsExitCode
- IsAmbiguousArgErr
- IsBadObject
- IsInvalidRefErr
- Unwrap
- AsError
```

--------------------------------------------------------------------------------

---[FILE: option.go]---
Location: harness-main/git/command/option.go
Signals: N/A
Excerpt (<=80 chars):  type CmdOptionFunc func(c *Command)

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RunOption
- WithGlobal
- WithAction
- WithFlag
- WithArg
- WithPostSepArg
- WithEnv
- WithCommitter
- WithCommitterAndDate
- WithAuthor
- WithAuthorAndDate
- WithConfig
- WithAlternateObjectDirs
- WithDir
- WithStdin
- WithStdout
- WithStderr
- WithEnvs
```

--------------------------------------------------------------------------------

---[FILE: parser.go]---
Location: harness-main/git/command/parser.go
Signals: N/A
Excerpt (<=80 chars): func Parse(args ...string) *Command {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Parse
- cmpPos
```

--------------------------------------------------------------------------------

---[FILE: parser_test.go]---
Location: harness-main/git/command/parser_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParse(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- args
- TestParse
```

--------------------------------------------------------------------------------

---[FILE: diff.go]---
Location: harness-main/git/diff/diff.go
Signals: N/A
Excerpt (<=80 chars): type LineType uint8

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Line
- Section
- File
- Parser
- NumLines
- Status
- NumSections
- NumAdditions
- NumChanges
- NumDeletions
- Mode
- OldMode
- IsEmpty
- readLine
- parseFileHeader
- parseSection
- Parse
```

--------------------------------------------------------------------------------

---[FILE: diff_test.go]---
Location: harness-main/git/diff/diff_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseFileHeader(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestParseFileHeader
```

--------------------------------------------------------------------------------

---[FILE: merge.go]---
Location: harness-main/git/enum/merge.go
Signals: N/A
Excerpt (<=80 chars): type MergeMethod string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: ref.go]---
Location: harness-main/git/enum/ref.go
Signals: N/A
Excerpt (<=80 chars):  type RefType int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- String
```

--------------------------------------------------------------------------------

---[FILE: aggregate_xor.go]---
Location: harness-main/git/hash/aggregate_xor.go
Signals: N/A
Excerpt (<=80 chars): type xorAggregator struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- xorAggregator
- Empty
- Hash
- Append
- xorInPlace
```

--------------------------------------------------------------------------------

---[FILE: aggregate_xor_test.go]---
Location: harness-main/git/hash/aggregate_xor_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestXORAggregator_Empty(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestXORAggregator_Empty
- TestXORAggregator_Single
- TestXORAggregator_Multi
- TestXORAggregator_MultiSame
- TestAppendMulti
- TestAppendSame
```

--------------------------------------------------------------------------------

---[FILE: git.go]---
Location: harness-main/git/hash/git.go
Signals: N/A
Excerpt (<=80 chars): func SerializeReference(ref string, sha string) []byte {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SerializeReference
- SerializeHead
```

--------------------------------------------------------------------------------

---[FILE: hash.go]---
Location: harness-main/git/hash/hash.go
Signals: N/A
Excerpt (<=80 chars): type Type string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Aggregator
- New
- getHashFactoryMethod
```

--------------------------------------------------------------------------------

---[FILE: source.go]---
Location: harness-main/git/hash/source.go
Signals: N/A
Excerpt (<=80 chars): type Source interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Source
- SourceNext
- Next
- SourceFromSlice
- SourceFromChannel
```

--------------------------------------------------------------------------------

---[FILE: source_test.go]---
Location: harness-main/git/hash/source_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestSourceFromChannel_blockingChannel(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestSourceFromChannel_blockingChannel
- TestSourceFromChannel_contextCanceled
- TestSourceFromChannel_sourceChannelDrainedOnClosing
- TestSourceFromChannel_errorReturnedOnError
- TestSourceFromChannel_fullChannel
```

--------------------------------------------------------------------------------

---[FILE: cli.go]---
Location: harness-main/git/hook/cli.go
Signals: N/A
Excerpt (<=80 chars): func SanitizeArgsForGit(command string, args []string) ([]string, bool) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KingpinRegister
- preReceiveCommand
- updateCommand
- postReceiveCommand
- SanitizeArgsForGit
- RegisterAll
- RegisterPreReceive
- RegisterUpdate
- RegisterPostReceive
- run
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/git/hook/client.go
Signals: N/A
Excerpt (<=80 chars): type Client interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Client
- ClientFactory
- EnvVarsToMap
```

--------------------------------------------------------------------------------

---[FILE: client_ noop.go]---
Location: harness-main/git/hook/client_ noop.go
Signals: N/A
Excerpt (<=80 chars): type NoopClient struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoopClient
- NewNoopClient
- PreReceive
- Update
- PostReceive
```

--------------------------------------------------------------------------------

---[FILE: cli_core.go]---
Location: harness-main/git/hook/cli_core.go
Signals: N/A
Excerpt (<=80 chars): type CLICore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CLICore
- NewCLICore
- PreReceive
- Update
- PostReceive
- handleServerHookOutput
- getUpdatedReferencesFromStdIn
- getAlternateObjectDirsFromEnv
```

--------------------------------------------------------------------------------

---[FILE: env.go]---
Location: harness-main/git/hook/env.go
Signals: N/A
Excerpt (<=80 chars): func GenerateEnvironmentVariables(payload any) (map[string]string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateEnvironmentVariables
- getRequiredEnvironmentVariable
```

--------------------------------------------------------------------------------

---[FILE: refupdate.go]---
Location: harness-main/git/hook/refupdate.go
Signals: N/A
Excerpt (<=80 chars): func CreateRefUpdater(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RefUpdater
- CreateRefUpdater
- String
- Do
- DoOne
- Init
- Pre
- UpdateRef
- Post
- getRef
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/git/hook/types.go
Signals: N/A
Excerpt (<=80 chars): type Output struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Output
- ReferenceUpdate
- Environment
- PreReceiveInput
- UpdateInput
- PostReceiveInput
```

--------------------------------------------------------------------------------

---[FILE: stale_files.go]---
Location: harness-main/git/maintenance/stale_files.go
Signals: N/A
Excerpt (<=80 chars):  func FindTempObjects(repoPath string) ([]string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindTempObjects
- isStaleTempObject
```

--------------------------------------------------------------------------------

---[FILE: check.go]---
Location: harness-main/git/merge/check.go
Signals: N/A
Excerpt (<=80 chars): func FindConflicts(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindConflicts
- CommitCount
```

--------------------------------------------------------------------------------

---[FILE: merge.go]---
Location: harness-main/git/merge/merge.go
Signals: N/A
Excerpt (<=80 chars):  type Params struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Params
- Merge
- Squash
- mergeInternal
- Rebase
- FastForward
```

--------------------------------------------------------------------------------

---[FILE: commit_message.go]---
Location: harness-main/git/parser/commit_message.go
Signals: N/A
Excerpt (<=80 chars): func CleanUpWhitespace(message string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CleanUpWhitespace
- ExtractSubject
- SplitMessage
```

--------------------------------------------------------------------------------

---[FILE: commit_message_test.go]---
Location: harness-main/git/parser/commit_message_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestCleanUpWhitespace(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCleanUpWhitespace
- TestExtractSubject
- TestSplitMessage
```

--------------------------------------------------------------------------------

---[FILE: diff_cut.go]---
Location: harness-main/git/parser/diff_cut.go
Signals: N/A
Excerpt (<=80 chars):  type DiffFileHeader struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiffFileHeader
- DiffCutParams
- strCircBuf
- DiffCut
- scanFileHeader
- scanHunkHeader
- scanHunkLine
- BlobCut
- LimitLineLen
- newStrCircBuf
- push
- lines
```

--------------------------------------------------------------------------------

---[FILE: diff_cut_test.go]---
Location: harness-main/git/parser/diff_cut_test.go
Signals: N/A
Excerpt (<=80 chars): func TestDiffCut(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDiffCut
- TestDiffCutNoEOLInOld
- TestDiffCutNoEOLInNew
- TestBlobCut
- TestStrCircBuf
```

--------------------------------------------------------------------------------

---[FILE: diff_headers.go]---
Location: harness-main/git/parser/diff_headers.go
Signals: N/A
Excerpt (<=80 chars):  type DiffFileHunkHeaders struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiffFileHunkHeaders
- ParseDiffFileHeader
- GetHunkHeaders
- readLinePrefix
```

--------------------------------------------------------------------------------

---[FILE: diff_headers_extended.go]---
Location: harness-main/git/parser/diff_headers_extended.go
Signals: N/A
Excerpt (<=80 chars): func ParseDiffFileExtendedHeader(line string) (string, string) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseDiffFileExtendedHeader
- DiffExtHeaderParseIndex
```

--------------------------------------------------------------------------------

---[FILE: diff_headers_test.go]---
Location: harness-main/git/parser/diff_headers_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetHunkHeaders(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetHunkHeaders
- TestReadLinePrefix
```

--------------------------------------------------------------------------------

---[FILE: diff_raw.go]---
Location: harness-main/git/parser/diff_raw.go
Signals: N/A
Excerpt (<=80 chars):  type DiffStatus byte

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiffRawFile
- BatchCheckObject
- String
- DiffRaw
- CatFileBatchCheckAllObjects
```

--------------------------------------------------------------------------------

---[FILE: hunk.go]---
Location: harness-main/git/parser/hunk.go
Signals: N/A
Excerpt (<=80 chars):  type Hunk struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hunk
- HunkHeader
- Cut
- CutHeader
- IsZero
- IsValid
- String
- ParseDiffHunkHeader
```

--------------------------------------------------------------------------------

---[FILE: lfs_pointers.go]---
Location: harness-main/git/parser/lfs_pointers.go
Signals: N/A
Excerpt (<=80 chars):  type LFSPointer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LFSPointer
- GetLFSObjectID
- IsLFSPointer
```

--------------------------------------------------------------------------------

---[FILE: raw_header.go]---
Location: harness-main/git/parser/raw_header.go
Signals: N/A
Excerpt (<=80 chars):  func ObjectHeaderIdentity(line string) (name string, email string, timestamp...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ObjectHeaderIdentity
```

--------------------------------------------------------------------------------

---[FILE: raw_header_test.go]---
Location: harness-main/git/parser/raw_header_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestObjectHeaderIdentity(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestObjectHeaderIdentity
```

--------------------------------------------------------------------------------

---[FILE: raw_object.go]---
Location: harness-main/git/parser/raw_object.go
Signals: N/A
Excerpt (<=80 chars):  type ObjectRaw struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ObjectRaw
- ObjectHeader
- Object
- getHeader
```

--------------------------------------------------------------------------------

---[FILE: raw_object_test.go]---
Location: harness-main/git/parser/raw_object_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestObject(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestObject
- TestObjectNegative
```

--------------------------------------------------------------------------------

---[FILE: reference_list.go]---
Location: harness-main/git/parser/reference_list.go
Signals: N/A
Excerpt (<=80 chars):  func ReferenceList(r io.Reader) (map[string]sha.SHA, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReferenceList
```

--------------------------------------------------------------------------------

---[FILE: reference_list_test.go]---
Location: harness-main/git/parser/reference_list_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestReferenceList(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestReferenceList
```

--------------------------------------------------------------------------------

---[FILE: scanner.go]---
Location: harness-main/git/parser/scanner.go
Signals: N/A
Excerpt (<=80 chars):  type Scanner interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Scanner
- ScannerWithPeek
- ScanZeroSeparated
- ScanLinesWithEOF
- NewScannerWithPeek
- scan
- Peek
- Err
- Bytes
- Text
```

--------------------------------------------------------------------------------

---[FILE: scanner_test.go]---
Location: harness-main/git/parser/scanner_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_scannerWithPeekSmoke(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test_scannerWithPeekSmoke
- Test_scannerWithPeekDualPeek
```

--------------------------------------------------------------------------------

---[FILE: text.go]---
Location: harness-main/git/parser/text.go
Signals: N/A
Excerpt (<=80 chars):  func newUTF8Scanner(inner Scanner, modifier func([]byte) []byte) *utf8Scanner {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- utf8Scanner
- newUTF8Scanner
- Scan
- Err
- Bytes
- Text
- ReadTextFile
- HasLineEnding
- HasLineEndingLF
- HasLineEndingCRLF
```

--------------------------------------------------------------------------------

---[FILE: text_test.go]---
Location: harness-main/git/parser/text_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_readTextFileEmpty(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test_readTextFileEmpty
- Test_readTextFileFirstLineNotUTF8
- Test_readTextFileNoLineEnding
- Test_readTextFileLineEndingLF
- Test_readTextFileLineEndingCRLF
- Test_readTextFileLineEndingMultiple
- Test_readTextFileLineEndingReplacementEmpty
- Test_readTextFileLineEndingReplacement
```

--------------------------------------------------------------------------------

---[FILE: sha.go]---
Location: harness-main/git/sha/sha.go
Signals: N/A
Excerpt (<=80 chars): type SHA struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SHA
- New
- NewOrEmpty
- GobEncode
- GobDecode
- UnmarshalJSON
- MarshalJSON
- String
- IsNil
- IsEmpty
- Equal
- Must
- JSONSchema
- Value
```

--------------------------------------------------------------------------------

---[FILE: sha_test.go]---
Location: harness-main/git/sha/sha_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNew(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNew
- TestNewOrEmpty
- TestSHA_IsNil
- TestSHA_IsEmpty
- TestSHA_Equal
- TestSHA_String
- TestSHA_Value
- TestSHA_GobEncodeDecode
- TestSHA_GobEncodeDecodeWithGob
- TestMust
- TestSHA_MarshalJSON
- TestSHA_UnmarshalJSON
- TestSHA_JSONSchema
```

--------------------------------------------------------------------------------

---[FILE: line_number.go]---
Location: harness-main/git/sharedrepo/line_number.go
Signals: N/A
Excerpt (<=80 chars):  type lineNumber int64

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IsEOF
- String
- parseLineNumber
```

--------------------------------------------------------------------------------

---[FILE: line_number_test.go]---
Location: harness-main/git/sharedrepo/line_number_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_lineNumberIsEOF(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test_lineNumberIsEOF
- Test_lineNumberString
- Test_parseLineNumber
```

--------------------------------------------------------------------------------

---[FILE: remote.go]---
Location: harness-main/git/sharedrepo/remote.go
Signals: N/A
Excerpt (<=80 chars): func (r *SharedRepo) FetchObjects(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FetchObjects
```

--------------------------------------------------------------------------------

---[FILE: run.go]---
Location: harness-main/git/sharedrepo/run.go
Signals: N/A
Excerpt (<=80 chars): func Run(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Run
```

--------------------------------------------------------------------------------

---[FILE: sharedrepo.go]---
Location: harness-main/git/sharedrepo/sharedrepo.go
Signals: N/A
Excerpt (<=80 chars):  type SharedRepo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharedRepo
- fileEntry
- patchTextFileReplacement
- NewSharedRepo
- Close
- Init
- Directory
- SetDefaultIndex
- SetIndex
- ClearIndex
- LsFiles
- RemoveFilesFromIndex
- WriteGitObject
- GetTreeSHA
- ShowFile
- AddObjectToIndex
- WriteTree
- MergeTree
```

--------------------------------------------------------------------------------

---[FILE: sharedrepo_test.go]---
Location: harness-main/git/sharedrepo/sharedrepo_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_parsePatchTextFilePayloads(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- arg
- Test_parsePatchTextFilePayloads
- Test_patchTextFileWritePatchedFile
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/git/storage/local.go
Signals: N/A
Excerpt (<=80 chars):  type LocalStore struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalStore
- NewLocalStore
- Save
```

--------------------------------------------------------------------------------

---[FILE: storage.go]---
Location: harness-main/git/storage/storage.go
Signals: N/A
Excerpt (<=80 chars):  type Store interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Store
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/git/storage/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideLocalStore() Store {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideLocalStore
```

--------------------------------------------------------------------------------

---[FILE: file.go]---
Location: harness-main/git/tempdir/file.go
Signals: N/A
Excerpt (<=80 chars): func CreateTemporaryPath(reposTempPath, prefix string) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTemporaryPath
- RemoveTemporaryPath
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/git/types/config.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- LastCommitCacheConfig
```

--------------------------------------------------------------------------------

---[FILE: server.go]---
Location: harness-main/http/server.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Server
- NewServer
- ListenAndServe
- ListenAndServeMTLS
- listenAndServeTLS
- listenAndServeAcme
- redirect
```

--------------------------------------------------------------------------------

---[FILE: docker_client_factory.go]---
Location: harness-main/infraprovider/docker_client_factory.go
Signals: N/A
Excerpt (<=80 chars):  type DockerClientFactory struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerClientFactory
- NewDockerClientFactory
- NewDockerClient
- getClient
- getHTTPSClient
- dockerOpts
```

--------------------------------------------------------------------------------

---[FILE: docker_config.go]---
Location: harness-main/infraprovider/docker_config.go
Signals: N/A
Excerpt (<=80 chars):  type DockerConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerConfig
```

--------------------------------------------------------------------------------

---[FILE: docker_provider.go]---
Location: harness-main/infraprovider/docker_provider.go
Signals: N/A
Excerpt (<=80 chars):  type DockerProvider struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerProvider
- NewDockerProvider
- Provision
- Find
- FindInfraStatus
- Stop
- CleanupInstanceResources
- Deprovision
- deleteVolume
- findVolume
- AvailableParams
- ValidateParams
- UpdateParams
- TemplateParams
- ProvisioningType
- UpdateConfig
- dockerHostInfo
- createNamedVolume
```

--------------------------------------------------------------------------------

---[FILE: infra_provider.go]---
Location: harness-main/infraprovider/infra_provider.go
Signals: N/A
Excerpt (<=80 chars):  type InfraProvider interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfraProvider
```

--------------------------------------------------------------------------------

---[FILE: infra_provider_factory.go]---
Location: harness-main/infraprovider/infra_provider_factory.go
Signals: N/A
Excerpt (<=80 chars):  type Factory interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Factory
- NewFactory
- GetInfraProvider
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/infraprovider/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideDockerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideDockerProvider
- ProvideFactory
- ProvideDockerClientFactory
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/job/config.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: definition.go]---
Location: harness-main/job/definition.go
Signals: N/A
Excerpt (<=80 chars):  type Definition struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Definition
- Validate
- toNewJob
```

--------------------------------------------------------------------------------

---[FILE: enum.go]---
Location: harness-main/job/enum.go
Signals: N/A
Excerpt (<=80 chars): type State string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllJobStates
- IsCompleted
```

--------------------------------------------------------------------------------

---[FILE: executor.go]---
Location: harness-main/job/executor.go
Signals: N/A
Excerpt (<=80 chars): type Executor struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Executor
- Handler
- NewExecutor
- Register
- finishRegistration
- exec
- FailProgress
```

--------------------------------------------------------------------------------

---[FILE: job_overdue.go]---
Location: harness-main/job/job_overdue.go
Signals: N/A
Excerpt (<=80 chars):  type jobOverdue struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jobOverdue
- newJobOverdue
- Handle
```

--------------------------------------------------------------------------------

---[FILE: job_purge.go]---
Location: harness-main/job/job_purge.go
Signals: N/A
Excerpt (<=80 chars):  type jobPurge struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jobPurge
- newJobPurge
- Handle
```

--------------------------------------------------------------------------------

---[FILE: lock.go]---
Location: harness-main/job/lock.go
Signals: N/A
Excerpt (<=80 chars):  func globalLock(ctx context.Context, manager lock.MutexManager) (lock.Mutex,...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- globalLock
```

--------------------------------------------------------------------------------

---[FILE: pubsub.go]---
Location: harness-main/job/pubsub.go
Signals: N/A
Excerpt (<=80 chars):  func encodeStateChange(job *Job) ([]byte, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encodeStateChange
- DecodeStateChange
- publishStateChange
```

--------------------------------------------------------------------------------

---[FILE: scheduler.go]---
Location: harness-main/job/scheduler.go
Signals: N/A
Excerpt (<=80 chars): type Scheduler struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Scheduler
- NewScheduler
- Run
- WaitJobsDone
- CancelJob
- handleCancelJob
- scheduleProcessing
- scheduleIfHaveMoreJobs
- RunJob
- RunJobs
- processReadyJobs
- availableSlots
- preExec
- doExec
- postExec
- GetJobProgress
- GetJobProgressForGroup
```

--------------------------------------------------------------------------------

---[FILE: store.go]---
Location: harness-main/job/store.go
Signals: N/A
Excerpt (<=80 chars):  type Store interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Store
```

--------------------------------------------------------------------------------

---[FILE: timer.go]---
Location: harness-main/job/timer.go
Signals: N/A
Excerpt (<=80 chars):  type schedulerTimer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- schedulerTimer
- newSchedulerTimer
- ResetAt
- RescheduleEarlier
- Ch
- Stop
```

--------------------------------------------------------------------------------

---[FILE: timer_test.go]---
Location: harness-main/job/timer_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestSchedulerTimer_ResetAt(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestSchedulerTimer_ResetAt
- TestSchedulerTimer_TryResetAt
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/job/types.go
Signals: N/A
Excerpt (<=80 chars):  type Job struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Job
- StateChange
- Progress
```

--------------------------------------------------------------------------------

---[FILE: uid.go]---
Location: harness-main/job/uid.go
Signals: N/A
Excerpt (<=80 chars): func UID() (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UID
```

--------------------------------------------------------------------------------

---[FILE: uid_test.go]---
Location: harness-main/job/uid_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestUID(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestUID
- TestUIDUniqueness
- TestUIDConsistentLength
- TestUIDBase32Encoding
- TestUIDNoPadding
- BenchmarkUID
- BenchmarkUIDParallel
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/job/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideExecutor(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideExecutor
- ProvideScheduler
```

--------------------------------------------------------------------------------

---[FILE: livelog.go]---
Location: harness-main/livelog/livelog.go
Signals: N/A
Excerpt (<=80 chars): type Line struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Line
- LogStreamInfo
- LogStream
```

--------------------------------------------------------------------------------

---[FILE: livelog_test.go]---
Location: harness-main/livelog/livelog_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestLine(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestLine
- TestLogStreamInfo
- TestLogStreamInfo_NilStreams
- TestLine_JSONTags
- TestLogStreamInfo_JSONTags
```

--------------------------------------------------------------------------------

---[FILE: memory.go]---
Location: harness-main/livelog/memory.go
Signals: N/A
Excerpt (<=80 chars):  type streamer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- streamer
- NewMemory
- Create
- Delete
- Write
- Tail
- Info
```

--------------------------------------------------------------------------------

````
