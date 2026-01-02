---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 8
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 8 of 37)

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

---[FILE: events_reviewer.go]---
Location: harness-main/app/events/pullreq/events_reviewer.go
Signals: N/A
Excerpt (<=80 chars):  type ReviewerAddedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewerAddedPayload
- UserGroupReviewerAddedPayload
- ReviewerAdded
- RegisterReviewerAdded
- UserGroupReviewerAdded
- RegisterUserGroupReviewerAdded
```

--------------------------------------------------------------------------------

---[FILE: events_review_submitted.go]---
Location: harness-main/app/events/pullreq/events_review_submitted.go
Signals: N/A
Excerpt (<=80 chars):  type ReviewSubmittedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewSubmittedPayload
- ReviewSubmitted
- RegisterReviewSubmitted
```

--------------------------------------------------------------------------------

---[FILE: events_state.go]---
Location: harness-main/app/events/pullreq/events_state.go
Signals: N/A
Excerpt (<=80 chars):  type CreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatedPayload
- ClosedPayload
- ReopenedPayload
- MergedPayload
- UpdatedPayload
- Created
- RegisterCreated
- Closed
- RegisterClosed
- Reopened
- RegisterReopened
- Merged
- RegisterMerged
- Updated
- RegisterUpdated
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/pullreq/reader.go
Signals: N/A
Excerpt (<=80 chars):  func NewReaderFactory(eventsSystem *events.System) (*events.ReaderFactory[*R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reader
- NewReaderFactory
- Configure
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/app/events/pullreq/reporter.go
Signals: N/A
Excerpt (<=80 chars): type Reporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- NewReporter
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/events/pullreq/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideReporter
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/events/repo/events.go
Signals: N/A
Excerpt (<=80 chars):  type Base struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Base
```

--------------------------------------------------------------------------------

---[FILE: events_repo.go]---
Location: harness-main/app/events/repo/events_repo.go
Signals: N/A
Excerpt (<=80 chars):  type CreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatedPayload
- StateChangedPayload
- PublicAccessChangedPayload
- SoftDeletedPayload
- DeletedPayload
- DefaultBranchUpdatedPayload
- PushedPayload
- Created
- RegisterCreated
- StateChanged
- RegisterStateChanged
- PublicAccessChanged
- RegisterPublicAccessChanged
- SoftDeleted
- RegisterSoftDeleted
- Deleted
- RegisterDeleted
- DefaultBranchUpdated
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/repo/reader.go
Signals: N/A
Excerpt (<=80 chars):  func NewReaderFactory(eventsSystem *events.System) (*events.ReaderFactory[*R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reader
- NewReaderFactory
- Configure
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/app/events/repo/reporter.go
Signals: N/A
Excerpt (<=80 chars): type Reporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- NewReporter
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/events/repo/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideReporter
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/events/rule/events.go
Signals: N/A
Excerpt (<=80 chars):  type Base struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Base
```

--------------------------------------------------------------------------------

---[FILE: events_rule.go]---
Location: harness-main/app/events/rule/events_rule.go
Signals: N/A
Excerpt (<=80 chars):  type CreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatedPayload
- Created
- RegisterCreated
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/rule/reader.go
Signals: N/A
Excerpt (<=80 chars):  func NewReaderFactory(eventsSystem *events.System) (*events.ReaderFactory[*R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reader
- NewReaderFactory
- Configure
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/app/events/rule/reporter.go
Signals: N/A
Excerpt (<=80 chars): type Reporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- NewReporter
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/events/rule/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideReporter
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/events/user/events.go
Signals: N/A
Excerpt (<=80 chars):  type Base struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Base
```

--------------------------------------------------------------------------------

---[FILE: events_user.go]---
Location: harness-main/app/events/user/events_user.go
Signals: N/A
Excerpt (<=80 chars):  type RegisteredPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegisteredPayload
- CreatedPayload
- LoggedInPayload
- Registered
- RegisterRegistered
- Created
- RegisterCreated
- LoggedIn
- RegisterLoggedIn
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/user/reader.go
Signals: N/A
Excerpt (<=80 chars):  func NewReaderFactory(eventsSystem *events.System) (*events.ReaderFactory[*R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reader
- NewReaderFactory
- Configure
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/app/events/user/reporter.go
Signals: N/A
Excerpt (<=80 chars): type Reporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- NewReporter
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/events/user/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideReporter
```

--------------------------------------------------------------------------------

---[FILE: client_rest.go]---
Location: harness-main/app/githook/client_rest.go
Signals: N/A
Excerpt (<=80 chars): type RestClientFactory struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestClientFactory
- RestClient
- NewClient
- NewRestClient
- PreReceive
- Update
- PostReceive
- githook
```

--------------------------------------------------------------------------------

---[FILE: env.go]---
Location: harness-main/app/githook/env.go
Signals: N/A
Excerpt (<=80 chars): func GenerateEnvironmentVariables(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateEnvironmentVariables
- LoadFromEnvironment
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/app/githook/types.go
Signals: N/A
Excerpt (<=80 chars): type Payload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Payload
- Validate
- GetInputBaseFromPayload
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/gitspace/infrastructure/find.go
Signals: N/A
Excerpt (<=80 chars): func (i InfraProvisioner) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
- paramsForProvisioningTypeNew
- deserializeInfraProviderParams
- paramsForProvisioningTypeExisting
- getGitspaceScheme
- GetInfraFromStoredInfo
- GetStoppedInfraFromStoredInfo
- getConfigFromResource
- getAllParamsFromDB
- getTemplateParams
- paramsFromResource
- configMetadata
```

--------------------------------------------------------------------------------

---[FILE: infra_post_exec.go]---
Location: harness-main/app/gitspace/infrastructure/infra_post_exec.go
Signals: N/A
Excerpt (<=80 chars): func (i InfraProvisioner) PostInfraEventComplete(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PostInfraEventComplete
- UpdateInfraProvisioned
```

--------------------------------------------------------------------------------

---[FILE: trigger_infra_event.go]---
Location: harness-main/app/gitspace/infrastructure/trigger_infra_event.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- InfraEventOpts
- InfraProvisioner
- NewInfraProvisionerService
- TriggerInfraEvent
- TriggerInfraEventWithOpts
- provisionNewInfrastructure
- provisionExistingInfrastructure
- deprovisionNewInfrastructure
- serializeInfraProviderParams
- useRoutingKey
- getRoutingKey
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/infrastructure/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideInfraProvisionerService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideInfraProvisionerService
```

--------------------------------------------------------------------------------

---[FILE: scanner.go]---
Location: harness-main/app/gitspace/logutil/scanner.go
Signals: N/A
Excerpt (<=80 chars):  type scanner struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- scanner
- newScanner
- scan
```

--------------------------------------------------------------------------------

---[FILE: stateful_logger.go]---
Location: harness-main/app/gitspace/logutil/stateful_logger.go
Signals: N/A
Excerpt (<=80 chars): type StatefulLogger struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StatefulLogger
- LogStreamInstance
- NewStatefulLogger
- CreateLogStream
- TailLogStream
- Write
- Flush
- Info
- Debug
- Warn
- Error
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/logutil/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideStatefulLogger(logz livelog.LogStream) *StatefulLogger {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideStatefulLogger
```

--------------------------------------------------------------------------------

---[FILE: orchestrator_resume.go]---
Location: harness-main/app/gitspace/orchestrator/orchestrator_resume.go
Signals: N/A
Excerpt (<=80 chars): func (o Orchestrator) ResumeStartGitspace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResumeStartGitspace
- newGitspaceError
- applyDefaultImageIfNeeded
- FinishResumeStartGitspace
- getIDEPort
- getProjectName
- getHost
- getUserName
- generateSSHCommand
- ResumeStopGitspace
- ResumeDeleteGitspace
- ResumeCleanupInstanceResources
- decryptAIAuth
- getConnectorRefs
- getAIAuthRefs
```

--------------------------------------------------------------------------------

---[FILE: orchestrator_trigger.go]---
Location: harness-main/app/gitspace/orchestrator/orchestrator_trigger.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Orchestrator
- NewOrchestrator
- TriggerStartGitspace
- TriggerStopGitspace
- stopGitspaceContainer
- FinishStopGitspaceContainer
- removeGitspaceContainer
- FinishRemoveGitspaceContainer
- TriggerCleanupInstanceResources
- TriggerDeleteGitspace
- emitGitspaceEvent
- getPortsRequiredForGitspace
- GetGitspaceLogs
- getProvisionedInfra
- TriggerAITask
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/orchestrator/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideOrchestrator(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideOrchestrator
```

--------------------------------------------------------------------------------

---[FILE: container_orchestrator.go]---
Location: harness-main/app/gitspace/orchestrator/container/container_orchestrator.go
Signals: N/A
Excerpt (<=80 chars):  type Orchestrator interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Orchestrator
```

--------------------------------------------------------------------------------

---[FILE: devcontainer_config_utils.go]---
Location: harness-main/app/gitspace/orchestrator/container/devcontainer_config_utils.go
Signals: N/A
Excerpt (<=80 chars):  func ExtractRunArgs(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExtractRunArgs
- getValues
- filterAllowedValues
- isArg
- ExtractEnv
- ExtractForwardPorts
- ExtractLifecycleCommands
- AddIDECustomizationsArg
- AddIDEDownloadURLArg
- AddIDEDirNameArg
```

--------------------------------------------------------------------------------

---[FILE: devcontainer_container_utils.go]---
Location: harness-main/app/gitspace/orchestrator/container/devcontainer_container_utils.go
Signals: N/A
Excerpt (<=80 chars): func logStreamWrapError(gitspaceLogger gitspaceTypes.GitspaceLogger, msg stri...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- logStreamWrapError
- ManageContainer
- FetchContainerState
- CreateContainer
- mergeLifeCycleHooks
- mergeEntrypoints
- applyPortMappings
- prepareHostConfig
- mergeMounts
- mergeSecurityOpts
- mergeCapAdd
- mergeInit
- mergePriviledged
- GetContainerInfo
- ExtractImageData
- CopyImage
- PullImage
- ExtractRunArgsWithLogging
```

--------------------------------------------------------------------------------

---[FILE: embedded_docker_container_orchestrator.go]---
Location: harness-main/app/gitspace/orchestrator/container/embedded_docker_container_orchestrator.go
Signals: N/A
Excerpt (<=80 chars):  type EmbeddedDockerOrchestrator struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmbeddedDockerOrchestrator
- step
- LifecycleHookStep
- ExecuteSteps
- NewEmbeddedDockerOrchestrator
- CreateAndStartGitspace
- startStoppedGitspace
- StopGitspace
- stopRunningGitspace
- Status
- StartAITask
- RemoveGitspace
- StreamLogs
- getAccessKey
- runGitspaceSetupSteps
- InstallFeatures
- buildSetupSteps
- setupGitspaceAndIDE
```

--------------------------------------------------------------------------------

---[FILE: orchestrator_factory.go]---
Location: harness-main/app/gitspace/orchestrator/container/orchestrator_factory.go
Signals: N/A
Excerpt (<=80 chars):  type Factory interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Factory
- NewFactory
- GetContainerOrchestrator
```

--------------------------------------------------------------------------------

---[FILE: runarg_utils.go]---
Location: harness-main/app/gitspace/orchestrator/container/runarg_utils.go
Signals: N/A
Excerpt (<=80 chars):  func getHostResources(runArgsMap map[types.RunArg]*types.RunArgValue) (conta...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getHostResources
- getNetworkMode
- getCapAdd
- getCapDrop
- getSHMSize
- getArgValueMemorySwapBytes
- getSysctls
- getDNS
- getDNSOptions
- getDNSSearch
- getCgroupNSMode
- getIPCMode
- getIsolation
- getRuntime
- getPlatform
- getPIDMode
- getSecurityOpt
- getStorageOpt
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/app/gitspace/orchestrator/container/util.go
Signals: N/A
Excerpt (<=80 chars):  func GetGitspaceContainerName(config types.GitspaceConfig) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetGitspaceContainerName
- GetUserHomeDir
- GetContainerUser
- GetRemoteUser
- ExtractRemoteUserFromLabels
- ExtractLifecycleHooksFromLabels
- ExecuteLifecycleCommands
- ProcessStartResponse
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/orchestrator/container/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideEmbeddedDockerOrchestrator(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideEmbeddedDockerOrchestrator
- ProvideContainerOrchestratorFactory
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/gitspace/orchestrator/container/response/delete.go
Signals: N/A
Excerpt (<=80 chars):  type DeleteResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteResponse
```

--------------------------------------------------------------------------------

---[FILE: start.go]---
Location: harness-main/app/gitspace/orchestrator/container/response/start.go
Signals: N/A
Excerpt (<=80 chars):  type StartResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StartResponse
```

--------------------------------------------------------------------------------

---[FILE: stop.go]---
Location: harness-main/app/gitspace/orchestrator/container/response/stop.go
Signals: N/A
Excerpt (<=80 chars):  type StopResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StopResponse
```

--------------------------------------------------------------------------------

---[FILE: exec.go]---
Location: harness-main/app/gitspace/orchestrator/devcontainer/exec.go
Signals: N/A
Excerpt (<=80 chars):  type Exec struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Exec
- execResult
- ExecuteCommand
- ExecuteCommandInHomeDirAndLog
- createExecution
- executeCmdAsyncStream
- executeCmdInHomeDirectoryAsyncStream
- attachAndInspectExec
- streamResponse
- copyOutput
- streamStdOut
- streamStdErr
- handleOutputChannel
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/app/gitspace/orchestrator/ide/common.go
Signals: N/A
Excerpt (<=80 chars):  func getIDEDownloadURL(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getIDEDownloadURL
- getIDEDirName
- getRepoName
```

--------------------------------------------------------------------------------

---[FILE: cursor.go]---
Location: harness-main/app/gitspace/orchestrator/ide/cursor.go
Signals: N/A
Excerpt (<=80 chars): type CursorConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CursorConfig
- Cursor
- NewCursorService
- Setup
- Run
- Port
- Type
- GenerateURL
- GeneratePluginURL
```

--------------------------------------------------------------------------------

---[FILE: factory.go]---
Location: harness-main/app/gitspace/orchestrator/ide/factory.go
Signals: N/A
Excerpt (<=80 chars):  type Factory struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Factory
- NewFactory
- NewFactoryWithIDEs
- GetIDE
```

--------------------------------------------------------------------------------

---[FILE: ide.go]---
Location: harness-main/app/gitspace/orchestrator/ide/ide.go
Signals: N/A
Excerpt (<=80 chars):  type IDE interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDE
- getHomePath
- setupSSHServer
- runSSHServer
```

--------------------------------------------------------------------------------

---[FILE: jetbrains.go]---
Location: harness-main/app/gitspace/orchestrator/ide/jetbrains.go
Signals: N/A
Excerpt (<=80 chars):  type JetBrainsIDEConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JetBrainsIDEConfig
- JetBrainsIDE
- NewJetBrainsIDEService
- port
- Setup
- setupJetbrainsIDE
- setupJetbrainsPlugins
- Run
- runRemoteIDE
- Type
- GenerateURL
- GeneratePluginURL
```

--------------------------------------------------------------------------------

---[FILE: vscode.go]---
Location: harness-main/app/gitspace/orchestrator/ide/vscode.go
Signals: N/A
Excerpt (<=80 chars):  type VSCodeConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VSCodeConfig
- VSCode
- NewVsCodeService
- Setup
- setupVSCodeExtensions
- Run
- Port
- Type
- updateVSCodeSetupPayload
- handleVSCodeCustomization
- GenerateURL
- GeneratePluginURL
```

--------------------------------------------------------------------------------

---[FILE: vscodeweb.go]---
Location: harness-main/app/gitspace/orchestrator/ide/vscodeweb.go
Signals: N/A
Excerpt (<=80 chars):  type VSCodeWebConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VSCodeWebConfig
- VSCodeWeb
- NewVsCodeWebService
- Setup
- updateMediaContent
- Run
- updateSetupPayloadFromArgs
- Port
- Type
- copyMediaToContainer
- embedToTar
- GenerateURL
- GeneratePluginURL
```

--------------------------------------------------------------------------------

---[FILE: windsurf.go]---
Location: harness-main/app/gitspace/orchestrator/ide/windsurf.go
Signals: N/A
Excerpt (<=80 chars): type WindsurfConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WindsurfConfig
- Windsurf
- NewWindsurfService
- Setup
- Run
- Port
- Type
- GenerateURL
- GeneratePluginURL
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/orchestrator/ide/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideVSCodeWebService(config *VSCodeWebConfig) *VSCodeWeb {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideVSCodeWebService
- ProvideVSCodeService
- ProvideCursorService
- ProvideWindsurfService
- ProvideJetBrainsIDEsService
- ProvideIDEFactory
```

--------------------------------------------------------------------------------

---[FILE: provider.go]---
Location: harness-main/app/gitspace/orchestrator/runarg/provider.go
Signals: N/A
Excerpt (<=80 chars):  type Provider interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Provider
```

--------------------------------------------------------------------------------

---[FILE: resolver.go]---
Location: harness-main/app/gitspace/orchestrator/runarg/resolver.go
Signals: N/A
Excerpt (<=80 chars):  type Resolver struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resolver
- NewResolver
- ResolveSupportedRunArgs
```

--------------------------------------------------------------------------------

---[FILE: static_provider.go]---
Location: harness-main/app/gitspace/orchestrator/runarg/static_provider.go
Signals: N/A
Excerpt (<=80 chars):  type StaticProvider struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StaticProvider
- NewStaticProvider
- ProvideSupportedRunArgs
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/orchestrator/runarg/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideStaticProvider(resolver *Resolver) (Provider, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideStaticProvider
- ProvideResolver
```

--------------------------------------------------------------------------------

---[FILE: ai_agent.go]---
Location: harness-main/app/gitspace/orchestrator/utils/ai_agent.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstallAIAgents
- ConfigureAIAgent
- installClaudeCode
- configureClaudeCode
```

--------------------------------------------------------------------------------

---[FILE: build_with_features.go]---
Location: harness-main/app/gitspace/orchestrator/utils/build_with_features.go
Signals: N/A
Excerpt (<=80 chars): func convertOptionsToEnvVariables(str string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertOptionsToEnvVariables
- BuildWithFeatures
- packBuildContextDirectory
- generateDockerFileWithFeatures
```

--------------------------------------------------------------------------------

---[FILE: download_features.go]---
Location: harness-main/app/gitspace/orchestrator/utils/download_features.go
Signals: N/A
Excerpt (<=80 chars):  type featureSource struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- featureSource
- DownloadFeatures
- downloadFeature
- getDevcontainerFeatureConfig
- getGitspaceInstanceDirectory
- getFeaturesDownloadDirectory
- getFeatureDownloadDirectory
- getFeatureFolderNameWithTag
- downloadTarballFromOCIRepo
- downloadTarball
- unpackTarball
- extractFile
```

--------------------------------------------------------------------------------

---[FILE: environment.go]---
Location: harness-main/app/gitspace/orchestrator/utils/environment.go
Signals: N/A
Excerpt (<=80 chars):  func GetOSInfoScript() (script string) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetOSInfoScript
- ValidateSupportedOS
- SetEnv
```

--------------------------------------------------------------------------------

---[FILE: git.go]---
Location: harness-main/app/gitspace/orchestrator/utils/git.go
Signals: N/A
Excerpt (<=80 chars):  func InstallGit(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstallGit
- SetupGitCredentials
- CloneCode
```

--------------------------------------------------------------------------------

---[FILE: image.go]---
Location: harness-main/app/gitspace/orchestrator/utils/image.go
Signals: N/A
Excerpt (<=80 chars):  func IsImagePresentLocally(ctx context.Context, imageName string, dockerClie...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IsImagePresentLocally
- CheckContainerImageExpression
- classifyWildcardRepo
- classifyWildcardTag
- classifyWildcardTagPrefix
- classifyWildcardRepoPrefix
- classifyStandardImage
- isValidTag
- MatchesContainerImageExpression
- getRepo
- splitImage
- IsValidContainerImage
```

--------------------------------------------------------------------------------

---[FILE: image_test.go]---
Location: harness-main/app/gitspace/orchestrator/utils/image_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestCheckContainerImageExpression(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCheckContainerImageExpression
- TestMatchesContainerImageExpression
```

--------------------------------------------------------------------------------

---[FILE: resolve_features.go]---
Location: harness-main/app/gitspace/orchestrator/utils/resolve_features.go
Signals: N/A
Excerpt (<=80 chars): func ResolveFeatures(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolveFeatures
- getResolvedOptions
- calculateDigest
```

--------------------------------------------------------------------------------

---[FILE: script_template.go]---
Location: harness-main/app/gitspace/orchestrator/utils/script_template.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- LoadTemplates
- GenerateScriptFromTemplate
```

--------------------------------------------------------------------------------

---[FILE: secret.go]---
Location: harness-main/app/gitspace/orchestrator/utils/secret.go
Signals: N/A
Excerpt (<=80 chars):  func ResolveSecret(ctx context.Context, secretResolverFactory *secret.Resolv...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolveSecret
- GetSecretType
```

--------------------------------------------------------------------------------

---[FILE: sort_features.go]---
Location: harness-main/app/gitspace/orchestrator/utils/sort_features.go
Signals: N/A
Excerpt (<=80 chars):  type node struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- node
- featureWithPriority
- SortFeatures
- getSourcesWithoutTagsMappedToDigests
- buildAdjacencyList
- populateSoftDependencies
- populateHardDependencies
- applyTopologicalSorting
- getFeaturesEligibleInThisRound
```

--------------------------------------------------------------------------------

---[FILE: tools.go]---
Location: harness-main/app/gitspace/orchestrator/utils/tools.go
Signals: N/A
Excerpt (<=80 chars):  func InstallTools(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstallTools
- InstallToolsForVsCodeWeb
- InstallToolsForVsCode
- InstallToolsForJetBrains
- InstallToolsForWindsurf
- InstallToolsForCursor
```

--------------------------------------------------------------------------------

---[FILE: user.go]---
Location: harness-main/app/gitspace/orchestrator/utils/user.go
Signals: N/A
Excerpt (<=80 chars):  func ManageUser(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManageUser
```

--------------------------------------------------------------------------------

---[FILE: gitnessplatformconnector.go]---
Location: harness-main/app/gitspace/platformconnector/gitnessplatformconnector.go
Signals: N/A
Excerpt (<=80 chars):  type GitnessPlatformConnector struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitnessPlatformConnector
- NewGitnessPlatformConnector
- FetchConnectors
```

--------------------------------------------------------------------------------

---[FILE: platformconnector.go]---
Location: harness-main/app/gitspace/platformconnector/platformconnector.go
Signals: N/A
Excerpt (<=80 chars):  type PlatformConnector interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PlatformConnector
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/platformconnector/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideGitnessPlatformConnector() PlatformConnector {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideGitnessPlatformConnector
```

--------------------------------------------------------------------------------

---[FILE: gitnessplatformsecret.go]---
Location: harness-main/app/gitspace/platformsecret/gitnessplatformsecret.go
Signals: N/A
Excerpt (<=80 chars):  type GitnessPlatformSecret struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitnessPlatformSecret
- NewGitnessPlatformSecret
- FetchSecret
```

--------------------------------------------------------------------------------

---[FILE: platformsecret.go]---
Location: harness-main/app/gitspace/platformsecret/platformsecret.go
Signals: N/A
Excerpt (<=80 chars):  type PlatformSecret interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PlatformSecret
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/platformsecret/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideGitnessPlatformSecret() PlatformSecret {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideGitnessPlatformSecret
```

--------------------------------------------------------------------------------

---[FILE: gitness_scm.go]---
Location: harness-main/app/gitspace/scm/gitness_scm.go
Signals: N/A
Excerpt (<=80 chars):  type GitnessSCM struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitnessSCM
- ListBranches
- mapBranch
- ListRepositories
- mapRepository
- NewGitnessSCM
- ResolveCredentials
- GetFileContent
- findUserFromUID
- GetBranchURL
```

--------------------------------------------------------------------------------

---[FILE: public_scm.go]---
Location: harness-main/app/gitspace/scm/public_scm.go
Signals: N/A
Excerpt (<=80 chars):  type GenericSCM struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericSCM
- NewGenericSCM
- ListBranches
- ListRepositories
- GetFileContent
- ResolveCredentials
- GetBranchURL
```

--------------------------------------------------------------------------------

---[FILE: scm.go]---
Location: harness-main/app/gitspace/scm/scm.go
Signals: N/A
Excerpt (<=80 chars):  type SCM struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SCM
- NewSCM
- CheckValidCodeRepo
- GetSCMRepoDetails
- detectDefaultGitBranch
- GetBranchURL
- detectBranch
- getSCMAuthAndFileProvider
- resolveRepoCredentials
- getDevcontainerConfig
- BuildAuthenticatedCloneURL
```

--------------------------------------------------------------------------------

---[FILE: scm_auth_file_provider.go]---
Location: harness-main/app/gitspace/scm/scm_auth_file_provider.go
Signals: N/A
Excerpt (<=80 chars):  type AuthAndFileContentProvider interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthAndFileContentProvider
```

--------------------------------------------------------------------------------

---[FILE: scm_factory.go]---
Location: harness-main/app/gitspace/scm/scm_factory.go
Signals: N/A
Excerpt (<=80 chars):  type Factory struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Factory
- NewFactoryWithProviders
- NewFactory
- GetSCMProvider
- GetSCMAuthAndFileProvider
```

--------------------------------------------------------------------------------

---[FILE: scm_listing_provider.go]---
Location: harness-main/app/gitspace/scm/scm_listing_provider.go
Signals: N/A
Excerpt (<=80 chars):  type ListingProvider interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListingProvider
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/app/gitspace/scm/types.go
Signals: N/A
Excerpt (<=80 chars):  type CodeRepositoryRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeRepositoryRequest
- CodeRepositoryResponse
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/scm/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideGitnessSCM(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideGitnessSCM
- ProvideGenericSCM
- ProvideFactory
- ProvideSCM
```

--------------------------------------------------------------------------------

---[FILE: password_resolver.go]---
Location: harness-main/app/gitspace/secret/password_resolver.go
Signals: N/A
Excerpt (<=80 chars):  type PasswordResolver struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordResolver
- NewPasswordResolver
- Resolve
- Type
```

--------------------------------------------------------------------------------

---[FILE: resolver.go]---
Location: harness-main/app/gitspace/secret/resolver.go
Signals: N/A
Excerpt (<=80 chars):  type ResolvedSecret struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolvedSecret
- ResolutionContext
- Resolver
```

--------------------------------------------------------------------------------

---[FILE: resolver_factory.go]---
Location: harness-main/app/gitspace/secret/resolver_factory.go
Signals: N/A
Excerpt (<=80 chars):  type ResolverFactory struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolverFactory
- NewFactoryWithProviders
- GetSecretResolver
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/gitspace/secret/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvidePasswordResolver() *PasswordResolver {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvidePasswordResolver
- ProvideResolverFactory
```

--------------------------------------------------------------------------------

---[FILE: script_template_payload.go]---
Location: harness-main/app/gitspace/types/script_template_payload.go
Signals: N/A
Excerpt (<=80 chars):  type CloneCodePayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CloneCodePayload
- SetupGitInstallPayload
- SetupGitCredentialsPayload
- RunVSCodeWebPayload
- SetupVSCodeWebPayload
- SetupUserPayload
- SetupSSHServerPayload
- SetupVSCodeExtensionsPayload
- RunSSHServerPayload
- InstallToolsPayload
- SupportedOSDistributionPayload
- SetEnvPayload
- SetupJetBrainsIDEPayload
- SetupJetBrainsPluginPayload
- RunIntellijIDEPayload
- SetupClaudeCodePayload
- ConfigureClaudeCodePayload
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/app/gitspace/types/types.go
Signals: N/A
Excerpt (<=80 chars):  type IDEArg string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitspaceLogger
- ZerologAdapter
- DockerRegistryAuth
```

--------------------------------------------------------------------------------

---[FILE: zerolog_adapter.go]---
Location: harness-main/app/gitspace/types/zerolog_adapter.go
Signals: N/A
Excerpt (<=80 chars): func NewZerologAdapter(logger *zerolog.Logger) *ZerologAdapter {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewZerologAdapter
- Info
- Debug
- Warn
- Error
```

--------------------------------------------------------------------------------

---[FILE: jwt.go]---
Location: harness-main/app/jwt/jwt.go
Signals: N/A
Excerpt (<=80 chars): type Source string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Claims
- SubClaimsToken
- SubClaimsMembership
- SubClaimsAccessPermissions
- AccessPermissions
- extractFirstSecretFromList
- GenerateForToken
- GenerateWithMembership
- GenerateForTokenWithAccessPermissions
```

--------------------------------------------------------------------------------

````
