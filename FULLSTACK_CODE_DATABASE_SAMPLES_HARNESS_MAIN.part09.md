---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 9
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 9 of 37)

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

---[FILE: paths.go]---
Location: harness-main/app/paths/paths.go
Signals: N/A
Excerpt (<=80 chars): func DisectLeaf(path string) (string, string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisectLeaf
- DisectRoot
- Concatenate
- Segments
- Depth
- IsAncesterOf
- Parent
```

--------------------------------------------------------------------------------

---[FILE: paths_test.go]---
Location: harness-main/app/paths/paths_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_Concatenate(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- testCase
- Test_Concatenate
- Test_Depth
- Test_DisectLeaf
- Test_DisectRoot
- Test_Segments
- Test_IsAncesterOf
- Test_Parent
```

--------------------------------------------------------------------------------

---[FILE: canceler.go]---
Location: harness-main/app/pipeline/canceler/canceler.go
Signals: N/A
Excerpt (<=80 chars):  type service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Canceler
- New
- Cancel
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/canceler/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideCanceler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideCanceler
```

--------------------------------------------------------------------------------

---[FILE: write.go]---
Location: harness-main/app/pipeline/checks/write.go
Signals: N/A
Excerpt (<=80 chars): func Write(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Write
```

--------------------------------------------------------------------------------

---[FILE: gitness.go]---
Location: harness-main/app/pipeline/commit/gitness.go
Signals: N/A
Excerpt (<=80 chars):  type service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newService
- FindRef
- FindCommit
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/commit/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideService(git git.Interface) Service {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: converter.go]---
Location: harness-main/app/pipeline/converter/converter.go
Signals: N/A
Excerpt (<=80 chars):  type converter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- converter
- newConverter
- Convert
- isJSONNet
- isStarlark
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/converter/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideService(fileService file.Service, publicAccess publicaccess.Servi...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: jsonnet.go]---
Location: harness-main/app/pipeline/converter/jsonnet/jsonnet.go
Signals: N/A
Excerpt (<=80 chars):  type importer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- importer
- Import
- Parse
- mapBuild
- mapRepo
- fromMap
```

--------------------------------------------------------------------------------

---[FILE: args.go]---
Location: harness-main/app/pipeline/converter/starlark/args.go
Signals: N/A
Excerpt (<=80 chars):  func createArgs(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createArgs
- fromBuild
- fromRepo
- fromMap
```

--------------------------------------------------------------------------------

---[FILE: starlark.go]---
Location: harness-main/app/pipeline/converter/starlark/starlark.go
Signals: N/A
Excerpt (<=80 chars):  func Parse(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Parse
- noLoad
```

--------------------------------------------------------------------------------

---[FILE: write.go]---
Location: harness-main/app/pipeline/converter/starlark/write.go
Signals: N/A
Excerpt (<=80 chars):  type writer interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- writer
- write
- isQuoteSafe
```

--------------------------------------------------------------------------------

---[FILE: gitness.go]---
Location: harness-main/app/pipeline/file/gitness.go
Signals: N/A
Excerpt (<=80 chars):  type service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newService
- Get
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/file/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideService(git git.Interface) Service {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: zerolog.go]---
Location: harness-main/app/pipeline/logger/zerolog.go
Signals: N/A
Excerpt (<=80 chars): func WithWrappedZerolog(ctx context.Context) context.Context {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- wrapZerolog
- WithWrappedZerolog
- WithUnwrappedZerolog
- WithError
- WithField
- Debug
- Debugf
- Debugln
- Error
- Errorf
- Errorln
- Info
- Infof
- Infoln
- Trace
- Tracef
- Traceln
- Warn
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/app/pipeline/manager/client.go
Signals: N/A
Excerpt (<=80 chars):  type embedded struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- embedded
- NewEmbeddedClient
- Join
- Leave
- Ping
- Request
- Accept
- Detail
- Update
- UpdateStep
- Watch
- Batch
- Upload
- UploadCard
```

--------------------------------------------------------------------------------

---[FILE: convert.go]---
Location: harness-main/app/pipeline/manager/convert.go
Signals: N/A
Excerpt (<=80 chars):  func ConvertToDroneStage(stage *types.Stage) *drone.Stage {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConvertToDroneStage
- ConvertToDroneSteps
- ConvertToDroneStep
- ConvertFromDroneStep
- ConvertFromDroneSteps
- ConvertFromDroneStage
- ConvertFromDroneLine
- ConvertToDroneBuild
- ConvertToDroneRepo
- ConvertToDroneFile
- ConvertToDroneSecret
- ConvertToDroneSecrets
- ConvertToDroneNetrc
```

--------------------------------------------------------------------------------

---[FILE: manager.go]---
Location: harness-main/app/pipeline/manager/manager.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Manager
- New
- Request
- Accept
- Write
- UploadLogs
- Details
- createNetrc
- BeforeStep
- AfterStep
- BeforeStage
- AfterStage
- Watch
```

--------------------------------------------------------------------------------

---[FILE: setup.go]---
Location: harness-main/app/pipeline/manager/setup.go
Signals: N/A
Excerpt (<=80 chars):  type setup struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setup
- do
- updateExecution
```

--------------------------------------------------------------------------------

---[FILE: teardown.go]---
Location: harness-main/app/pipeline/manager/teardown.go
Signals: N/A
Excerpt (<=80 chars):  type teardown struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- teardown
- do
- cancelDownstream
- isexecutionComplete
- areDepsComplete
- scheduleDownstream
- resync
- reportExecutionCompleted
```

--------------------------------------------------------------------------------

---[FILE: updater.go]---
Location: harness-main/app/pipeline/manager/updater.go
Signals: N/A
Excerpt (<=80 chars):  type updater struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updater
- do
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/manager/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideExecutionManager(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideExecutionManager
- ProvideExecutionClient
```

--------------------------------------------------------------------------------

---[FILE: manager.go]---
Location: harness-main/app/pipeline/resolver/manager.go
Signals: N/A
Excerpt (<=80 chars): type LookupFunc func(name, kind, typ, version string, id int64) (*v1yaml.Conf...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Manager
- NewManager
- GetLookupFn
- Populate
- downloadZip
- traverseAndUpsertPlugins
```

--------------------------------------------------------------------------------

---[FILE: resolve.go]---
Location: harness-main/app/pipeline/resolver/resolve.go
Signals: N/A
Excerpt (<=80 chars): func Resolve(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resolve
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/resolver/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideResolver(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideResolver
```

--------------------------------------------------------------------------------

---[FILE: poller.go]---
Location: harness-main/app/pipeline/runner/poller.go
Signals: N/A
Excerpt (<=80 chars):  func NewExecutionPoller(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewExecutionPoller
```

--------------------------------------------------------------------------------

---[FILE: runner.go]---
Location: harness-main/app/pipeline/runner/runner.go
Signals: N/A
Excerpt (<=80 chars): func dockerOpts(config *types.Config) []dockerclient.Opt {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dockerOpts
- NewExecutionRunner
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/runner/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideExecutionRunner(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideExecutionRunner
- ProvideExecutionPoller
```

--------------------------------------------------------------------------------

---[FILE: canceler.go]---
Location: harness-main/app/pipeline/scheduler/canceler.go
Signals: N/A
Excerpt (<=80 chars):  type canceler struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- canceler
- newCanceler
- Cancel
- Cancelled
- collect
```

--------------------------------------------------------------------------------

---[FILE: queue.go]---
Location: harness-main/app/pipeline/scheduler/queue.go
Signals: N/A
Excerpt (<=80 chars):  type queue struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- queue
- worker
- newQueue
- Schedule
- Pause
- Request
- signal
- start
- checkLabels
- withinLimits
- shouldThrottle
- matchResource
```

--------------------------------------------------------------------------------

---[FILE: scheduler.go]---
Location: harness-main/app/pipeline/scheduler/scheduler.go
Signals: N/A
Excerpt (<=80 chars): type Filter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Filter
- Scheduler
- newScheduler
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/scheduler/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideScheduler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideScheduler
```

--------------------------------------------------------------------------------

---[FILE: env.go]---
Location: harness-main/app/pipeline/triggerer/env.go
Signals: N/A
Excerpt (<=80 chars): func combine(env ...map[string]string) map[string]string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- combine
- Envs
```

--------------------------------------------------------------------------------

---[FILE: skip.go]---
Location: harness-main/app/pipeline/triggerer/skip.go
Signals: N/A
Excerpt (<=80 chars):  func skipBranch(document *yaml.Pipeline, branch string) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- skipBranch
- skipRef
- skipEvent
- skipAction
- skipRepo
- skipCron
```

--------------------------------------------------------------------------------

---[FILE: trigger.go]---
Location: harness-main/app/pipeline/triggerer/trigger.go
Signals: N/A
Excerpt (<=80 chars): type Hook struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hook
- Triggerer
- New
- Trigger
- trunc
- parseV1Stages
- isV1Yaml
- createExecutionWithStages
- createExecutionWithError
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/pipeline/triggerer/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideTriggerer(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideTriggerer
```

--------------------------------------------------------------------------------

---[FILE: dag.go]---
Location: harness-main/app/pipeline/triggerer/dag/dag.go
Signals: N/A
Excerpt (<=80 chars): type Dag struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Dag
- Vertex
- New
- Add
- Get
- Dependencies
- Ancestors
- DetectCycles
```

--------------------------------------------------------------------------------

---[FILE: dag_test.go]---
Location: harness-main/app/pipeline/triggerer/dag/dag_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestDag(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDag
- TestAncestors
- TestAncestors_Skipped
- TestAncestors_NotFound
- TestAncestors_Malformed
- TestAncestors_Complex
- TestDependencies
- TestDependencies_Skipped
- TestDependencies_Complex
```

--------------------------------------------------------------------------------

---[FILE: request.go]---
Location: harness-main/app/request/request.go
Signals: N/A
Excerpt (<=80 chars): func ReplacePrefix(r *http.Request, oldPrefix string, newPrefix string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReplacePrefix
```

--------------------------------------------------------------------------------

---[FILE: request_test.go]---
Location: harness-main/app/request/request_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestReplacePrefix(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestReplacePrefix
- TestReplacePrefix_PreservesOtherURLFields
- TestReplacePrefix_WithComplexURL
```

--------------------------------------------------------------------------------

---[FILE: api.go]---
Location: harness-main/app/router/api.go
Signals: N/A
Excerpt (<=80 chars): func NewAPIHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewAPIHandler
- corsHandler
- setupRoutesV1WithAuth
- setupSpaces
- SetupSpaceLabels
- SetupWebhookSpace
- SetupRulesSpace
- setupRepos
- SetupRepoLabels
- SetupUploads
- setupPipelines
- setupConnectors
- setupTemplates
- setupSecrets
- setupPlugins
- setupExecutions
- setupTriggers
- setupInternal
```

--------------------------------------------------------------------------------

---[FILE: api_router.go]---
Location: harness-main/app/router/api_router.go
Signals: N/A
Excerpt (<=80 chars):  type APIRouter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APIRouter
- NewAPIRouter
- Handle
- IsEligibleTraffic
- Name
```

--------------------------------------------------------------------------------

---[FILE: git.go]---
Location: harness-main/app/router/git.go
Signals: N/A
Excerpt (<=80 chars): func NewGitHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewGitHandler
- stubGitHandler
- GitLFSHandler
```

--------------------------------------------------------------------------------

---[FILE: git_router.go]---
Location: harness-main/app/router/git_router.go
Signals: N/A
Excerpt (<=80 chars):  type GitRouter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitRouter
- NewGitRouter
- Handle
- IsEligibleTraffic
- Name
```

--------------------------------------------------------------------------------

---[FILE: interface.go]---
Location: harness-main/app/router/interface.go
Signals: N/A
Excerpt (<=80 chars):  type Interface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Interface
```

--------------------------------------------------------------------------------

---[FILE: logging.go]---
Location: harness-main/app/router/logging.go
Signals: N/A
Excerpt (<=80 chars): func WithLoggingRouter(handler string) logging.Option {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WithLoggingRouter
```

--------------------------------------------------------------------------------

---[FILE: router.go]---
Location: harness-main/app/router/router.go
Signals: N/A
Excerpt (<=80 chars):  type Router struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Router
- NewRouter
- ServeHTTP
- StripPrefix
```

--------------------------------------------------------------------------------

---[FILE: router_test.go]---
Location: harness-main/app/router/router_test.go
Signals: N/A
Excerpt (<=80 chars): func TestTokenGate(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestTokenGate
- TestPipelineGate
- TestSystemGate
```

--------------------------------------------------------------------------------

---[FILE: secure.go]---
Location: harness-main/app/router/secure.go
Signals: N/A
Excerpt (<=80 chars): func NewSecure(config *types.Config) *secure.Secure {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewSecure
```

--------------------------------------------------------------------------------

---[FILE: web.go]---
Location: harness-main/app/router/web.go
Signals: N/A
Excerpt (<=80 chars): func NewWebHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewWebHandler
```

--------------------------------------------------------------------------------

---[FILE: web_router.go]---
Location: harness-main/app/router/web_router.go
Signals: N/A
Excerpt (<=80 chars):  type WebRouter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebRouter
- NewWebRouter
- Handle
- IsEligibleTraffic
- Name
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/router/wire.go
Signals: N/A
Excerpt (<=80 chars):  func GetGitRoutingHost(ctx context.Context, urlProvider url.Provider) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetGitRoutingHost
- ProvideRouter
```

--------------------------------------------------------------------------------

---[FILE: server.go]---
Location: harness-main/app/server/server.go
Signals: N/A
Excerpt (<=80 chars): type Server struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Server
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/server/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideServer(config *types.Config, router *router.Router) *Server {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideServer
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/wire.go
Signals: N/A
Excerpt (<=80 chars):  type Services struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Services
- GitspaceServices
- ProvideGitspaceServices
- ProvideServices
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/app/services/aitaskevent/handler.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleAITaskEvent(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleAITaskEvent
- fetchWithRetry
- handleStartEvent
- handleStopEvent
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/aitaskevent/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/aitaskevent/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: handler_branch.go]---
Location: harness-main/app/services/branch/handler_branch.go
Signals: N/A
Excerpt (<=80 chars):  func ExtractBranchName(ref string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExtractBranchName
- handleEventBranchCreated
- handleEventBranchUpdated
- handleEventBranchDeleted
```

--------------------------------------------------------------------------------

---[FILE: handler_pullreq.go]---
Location: harness-main/app/services/branch/handler_pullreq.go
Signals: N/A
Excerpt (<=80 chars): func (s *Service) handleEventPullReqCreated(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleEventPullReqCreated
- handleEventPullReqClosed
- handleEventPullReqReopened
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/branch/service.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Prepare
- New
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/branch/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: deleted_repos.go]---
Location: harness-main/app/services/cleanup/deleted_repos.go
Signals: N/A
Excerpt (<=80 chars):  type deletedReposCleanupJob struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- deletedReposCleanupJob
- newDeletedReposCleanupJob
- Handle
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/cleanup/service.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Prepare
- NewService
- Register
- scheduleRecurringCleanupJobs
- registerJobHandlers
```

--------------------------------------------------------------------------------

---[FILE: tokens.go]---
Location: harness-main/app/services/cleanup/tokens.go
Signals: N/A
Excerpt (<=80 chars):  type tokensCleanupJob struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tokensCleanupJob
- newTokensCleanupJob
- Handle
```

--------------------------------------------------------------------------------

---[FILE: webhook_executions.go]---
Location: harness-main/app/services/cleanup/webhook_executions.go
Signals: N/A
Excerpt (<=80 chars):  type webhookExecutionsCleanupJob struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhookExecutionsCleanupJob
- newWebhookExecutionsCleanupJob
- Handle
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/cleanup/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: migrator.go]---
Location: harness-main/app/services/codecomments/migrator.go
Signals: N/A
Excerpt (<=80 chars): type Migrator struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Migrator
- hunkHeaderFetcher
- MigrateNew
- MigrateOld
- migrate
- mapCodeComments
- processCodeComment
```

--------------------------------------------------------------------------------

---[FILE: migrator_test.go]---
Location: harness-main/app/services/codecomments/migrator_test.go
Signals: N/A
Excerpt (<=80 chars): func TestMigrator(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- position
- testHunkHeaderFetcher
- TestMigrator
- GetDiffHunkHeaders
- TestProcessCodeComment
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/codecomments/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideMigrator(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideMigrator
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/codeowners/service.go
Signals: N/A
Excerpt (<=80 chars): type TooLargeError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooLargeError
- FileParseError
- Config
- File
- CodeOwners
- Entry
- Evaluation
- EvaluationEntry
- UserGroupEvaluation
- UserEvaluation
- Error
- Is
- Unwrap
- IsOwnershipReset
- New
```

--------------------------------------------------------------------------------

---[FILE: service_test.go]---
Location: harness-main/app/services/codeowners/service_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestService_ParseCodeOwner(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fields
- args
- TestService_ParseCodeOwner
- Test_match
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/codeowners/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideCodeOwners(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideCodeOwners
```

--------------------------------------------------------------------------------

---[FILE: harness_code_client.go]---
Location: harness-main/app/services/exporter/harness_code_client.go
Signals: N/A
Excerpt (<=80 chars):  type harnessCodeClient struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- harnessCodeClient
- client
- newClient
- newHarnessCodeClient
- CreateRepo
- addQueryParams
- DeleteRepo
- appendPath
- Do
- addAuthHeader
- unmarshalResponse
- mapStatusCodeToError
```

--------------------------------------------------------------------------------

---[FILE: repository.go]---
Location: harness-main/app/services/exporter/repository.go
Signals: N/A
Excerpt (<=80 chars):  type Repository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Repository
- Input
- HarnessCodeInfo
- Register
- RunManyForSpace
- checkJobAlreadyRunning
- getJobGroupID
- Handle
- getJobInput
- GetProgressForSpace
- modifyURL
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/exporter/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideSpaceExporter(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideSpaceExporter
```

--------------------------------------------------------------------------------

---[FILE: actions.go]---
Location: harness-main/app/services/gitspace/actions.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) gitspaceBusyOperation(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitspaceBusyOperation
- submitAsyncOps
- triggerOrchestrator
- buildGitspaceInstance
- EmitGitspaceConfigEvent
```

--------------------------------------------------------------------------------

---[FILE: action_cleanup.go]---
Location: harness-main/app/services/gitspace/action_cleanup.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) CleanupGitspace(ctx context.Context, config types.Gitspace...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CleanupGitspace
```

--------------------------------------------------------------------------------

---[FILE: action_delete.go]---
Location: harness-main/app/services/gitspace/action_delete.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) DeleteGitspaceByIdentifier(ctx context.Context, spaceRef s...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteGitspaceByIdentifier
- deleteGitspace
- RemoveGitspace
```

--------------------------------------------------------------------------------

---[FILE: action_reset.go]---
Location: harness-main/app/services/gitspace/action_reset.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) ResetGitspaceAction(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResetGitspaceAction
```

--------------------------------------------------------------------------------

---[FILE: action_start.go]---
Location: harness-main/app/services/gitspace/action_start.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) StartGitspaceAction(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StartGitspaceAction
```

--------------------------------------------------------------------------------

---[FILE: action_stop.go]---
Location: harness-main/app/services/gitspace/action_stop.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) StopGitspaceAction(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StopGitspaceAction
- GitspaceAutostopAction
```

--------------------------------------------------------------------------------

---[FILE: delete_all_for_spaces.go]---
Location: harness-main/app/services/gitspace/delete_all_for_spaces.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) DeleteAllForSpaces(ctx context.Context, spaces []*types.Sp...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteAllForSpaces
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/services/gitspace/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) FindWithLatestInstanceWithSpacePath(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindWithLatestInstanceWithSpacePath
- FindWithLatestInstance
- findLatestInstance
- getToken
- getProjectName
- getGitspaceConfigState
- addOrUpdateInstanceParameters
- FindWithLatestInstanceByID
- FindAll
- FindAllByIdentifier
- FindInstanceByIdentifier
```

--------------------------------------------------------------------------------

---[FILE: gitspace.go]---
Location: harness-main/app/services/gitspace/gitspace.go
Signals: N/A
Excerpt (<=80 chars):  func NewService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- ListGitspacesWithInstance
- GetBranchURL
- Create
```

--------------------------------------------------------------------------------

---[FILE: update_config.go]---
Location: harness-main/app/services/gitspace/update_config.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) UpdateConfig(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateConfig
```

--------------------------------------------------------------------------------

---[FILE: update_instance.go]---
Location: harness-main/app/services/gitspace/update_instance.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) UpdateInstance(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateInstance
- formatURL
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/gitspace/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideGitspace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideGitspace
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/app/services/gitspacedeleteevent/handler.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleGitspaceDeleteEvent(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleGitspaceDeleteEvent
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/gitspacedeleteevent/service.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Sanitize
- NewService
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/gitspacedeleteevent/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/app/services/gitspaceevent/handler.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleGitspaceEvent(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleGitspaceEvent
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/gitspaceevent/service.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Sanitize
- NewService
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/gitspaceevent/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/app/services/gitspaceinfraevent/handler.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleGitspaceInfraResumeEvent(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleGitspaceInfraResumeEvent
- getConfig
- emitGitspaceConfigEvent
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/gitspaceinfraevent/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/gitspaceinfraevent/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/app/services/gitspaceoperationsevent/handler.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleGitspaceOperationsEvent(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleGitspaceOperationsEvent
- getConfig
- emitGitspaceConfigEvent
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/gitspaceoperationsevent/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/gitspaceoperationsevent/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/gitspacesettings/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- settingsService
- GetInfraProviderSettings
- NewSettingsService
- GetGitspaceConfigSettings
- ValidateGitspaceConfigCreate
- ValidateResolvedSCMDetails
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/gitspacesettings/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: base_transport.go]---
Location: harness-main/app/services/importer/base_transport.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: connector.go]---
Location: harness-main/app/services/importer/connector.go
Signals: N/A
Excerpt (<=80 chars):  type ConnectorDef struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectorDef
- AccessInfo
- URLWithCredentials
```

--------------------------------------------------------------------------------

---[FILE: connector_service.go]---
Location: harness-main/app/services/importer/connector_service.go
Signals: N/A
Excerpt (<=80 chars):  type ConnectorService interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectorService
- connectorServiceNoop
- GetAccessInfo
```

--------------------------------------------------------------------------------

---[FILE: importer.go]---
Location: harness-main/app/services/importer/importer.go
Signals: N/A
Excerpt (<=80 chars):  type Importer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Importer
- Input
- pipelineFile
- pipelineConverter
- NewImporter
- Enum
- Import
- createGitRepository
- syncGitRepository
- deleteGitRepository
- matchFiles
- createRPCWriteParams
- createEnvVars
- processPipelines
- convertPipelines
- convertPipelineFiles
```

--------------------------------------------------------------------------------

````
