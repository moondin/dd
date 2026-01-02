---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 17
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 17 of 37)

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

---[FILE: memory_test.go]---
Location: harness-main/livelog/memory_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNewMemory(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNewMemory
- TestStreamer_Create
- TestStreamer_Create_Multiple
- TestStreamer_Delete
- TestStreamer_Delete_NotFound
- TestStreamer_Write
- TestStreamer_Write_NotFound
- TestStreamer_Tail
- TestStreamer_Tail_NotFound
- TestStreamer_Tail_History
- TestStreamer_Info
- TestStreamer_ConcurrentAccess
- TestErrStreamNotFound
```

--------------------------------------------------------------------------------

---[FILE: stream.go]---
Location: harness-main/livelog/stream.go
Signals: N/A
Excerpt (<=80 chars):  type stream struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stream
- newStream
- write
- subscribe
- close
```

--------------------------------------------------------------------------------

---[FILE: stream_test.go]---
Location: harness-main/livelog/stream_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNewStream(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNewStream
- TestStream_Write
- TestStream_Write_BufferLimit
- TestStream_Subscribe
- TestStream_Subscribe_WithHistory
- TestStream_Subscribe_NewLines
- TestStream_Subscribe_ContextCancellation
- TestStream_Close
- TestStream_MultipleSubscribers
- TestBufferSize
```

--------------------------------------------------------------------------------

---[FILE: sub.go]---
Location: harness-main/livelog/sub.go
Signals: N/A
Excerpt (<=80 chars):  type subscriber struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- subscriber
- publish
- close
```

--------------------------------------------------------------------------------

---[FILE: sub_test.go]---
Location: harness-main/livelog/sub_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestSubscriber_Publish(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestSubscriber_Publish
- TestSubscriber_Publish_Multiple
- TestSubscriber_Publish_BufferFull
- TestSubscriber_Close
- TestSubscriber_Close_Multiple
- TestSubscriber_Publish_AfterClose
- TestSubscriber_Publish_ClosedChannel
- TestSubscriber_InitialState
- TestSubscriber_ConcurrentPublish
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/livelog/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideLogStream() LogStream {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideLogStream
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/lock/config.go
Signals: N/A
Excerpt (<=80 chars):  type Provider string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: lock.go]---
Location: harness-main/lock/lock.go
Signals: N/A
Excerpt (<=80 chars): type ErrorKind string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Error
- MutexManager
- Mutex
- NewError
```

--------------------------------------------------------------------------------

---[FILE: memory.go]---
Location: harness-main/lock/memory.go
Signals: N/A
Excerpt (<=80 chars): type InMemory struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InMemory
- inMemEntry
- inMemMutex
- NewInMemory
- NewMutex
- acquire
- release
- Key
- Lock
- retry
- Unlock
- randstr
```

--------------------------------------------------------------------------------

---[FILE: memory_test.go]---
Location: harness-main/lock/memory_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_inMemMutex_Lock(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test_inMemMutex_Lock
- Test_inMemMutex_MaxTries
- Test_inMemMutex_LockAndWait
```

--------------------------------------------------------------------------------

---[FILE: options.go]---
Location: harness-main/lock/options.go
Signals: N/A
Excerpt (<=80 chars): type Option interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Option
- Apply
- WithNamespace
- WithExpiry
- WithTries
- WithRetryDelay
- WithRetryDelayFunc
- WithDriftFactor
- WithTimeoutFactor
- WithGenValueFunc
- WithValue
```

--------------------------------------------------------------------------------

---[FILE: redis.go]---
Location: harness-main/lock/redis.go
Signals: N/A
Excerpt (<=80 chars): type Redis struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Redis
- RedisMutex
- NewRedis
- NewMutex
- Key
- Lock
- Unlock
- translateRedisErr
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/lock/util.go
Signals: N/A
Excerpt (<=80 chars):  func formatKey(app, ns, key string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatKey
- SplitKey
```

--------------------------------------------------------------------------------

---[FILE: util_test.go]---
Location: harness-main/lock/util_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestFormatKey(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestFormatKey
- TestSplitKey
- TestFormatAndSplitKey_RoundTrip
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/lock/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideMutexManager(config Config, client redis.UniversalClient) MutexM...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideMutexManager
```

--------------------------------------------------------------------------------

---[FILE: logging.go]---
Location: harness-main/logging/logging.go
Signals: N/A
Excerpt (<=80 chars): type Option func(c zerolog.Context) zerolog.Context

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateContext
- NewContext
- WithRequestID
```

--------------------------------------------------------------------------------

---[FILE: logging_test.go]---
Location: harness-main/logging/logging_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestWithRequestID(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestWithRequestID
- TestUpdateContext
- TestUpdateContextMultipleOptions
- TestNewContext
- TestNewContextMultipleOptions
- TestNewContextIsolation
- TestCustomOption
- TestEmptyOptions
- BenchmarkWithRequestID
- BenchmarkUpdateContext
- BenchmarkNewContext
```

--------------------------------------------------------------------------------

---[FILE: gcpprofiler.go]---
Location: harness-main/profiler/gcpprofiler.go
Signals: N/A
Excerpt (<=80 chars):  type GCPProfiler struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GCPProfiler
- StartProfiling
```

--------------------------------------------------------------------------------

---[FILE: noopprofiler.go]---
Location: harness-main/profiler/noopprofiler.go
Signals: N/A
Excerpt (<=80 chars):  type NoopProfiler struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoopProfiler
- StartProfiling
```

--------------------------------------------------------------------------------

---[FILE: profiler.go]---
Location: harness-main/profiler/profiler.go
Signals: N/A
Excerpt (<=80 chars):  type Profiler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Profiler
- ParseType
- New
```

--------------------------------------------------------------------------------

---[FILE: profiler_test.go]---
Location: harness-main/profiler/profiler_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseType(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestParseType
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/pubsub/config.go
Signals: N/A
Excerpt (<=80 chars):  type Provider string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: inmem.go]---
Location: harness-main/pubsub/inmem.go
Signals: N/A
Excerpt (<=80 chars):  type InMemory struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InMemory
- inMemorySubscriber
- NewInMemory
- Subscribe
- Publish
- Close
- start
- Unsubscribe
- isClosed
- formatTopics
```

--------------------------------------------------------------------------------

---[FILE: options.go]---
Location: harness-main/pubsub/options.go
Signals: N/A
Excerpt (<=80 chars): type Option interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Option
- SubscribeConfig
- SubscribeOption
- PublishConfig
- PublishOption
- Apply
- WithApp
- WithNamespace
- WithHealthCheckInterval
- WithSendTimeout
- WithSize
- WithTopics
- WithChannelNamespace
- WithChannelHealthCheckInterval
- WithChannelSendTimeout
- WithChannelSize
```

--------------------------------------------------------------------------------

---[FILE: pubsub.go]---
Location: harness-main/pubsub/pubsub.go
Signals: N/A
Excerpt (<=80 chars):  type Publisher interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Publisher
- PubSub
- Consumer
```

--------------------------------------------------------------------------------

---[FILE: redis.go]---
Location: harness-main/pubsub/redis.go
Signals: N/A
Excerpt (<=80 chars):  type Redis struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Redis
- redisSubscriber
- NewRedis
- Subscribe
- Publish
- Close
- start
- Unsubscribe
- formatTopics
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/pubsub/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvidePubSub(config Config, client redis.UniversalClient) PubSub {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvidePubSub
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/wire.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryApp struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryApp
- BlobStorageProvider
- NewHandlerProvider
- NewMavenHandlerProvider
- NewPackageHandlerProvider
- NewPythonHandlerProvider
- NewNugetHandlerProvider
- NewNPMHandlerProvider
- NewRpmHandlerProvider
- NewGenericHandlerProvider
- NewCargoHandlerProvider
- NewGoPackageHandlerProvider
- Wire
```

--------------------------------------------------------------------------------

---[FILE: artifact_mapper.go]---
Location: harness-main/registry/app/api/controller/metadata/artifact_mapper.go
Signals: N/A
Excerpt (<=80 chars):  func GetArtifactMetadata(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactMetadata
- GetRegistryArtifactMetadata
- GetMavenArtifactDetail
- mapToArtifactMetadata
- mapToRegistryArtifactMetadata
- toPackageType
- GetTagMetadata
- GetAllArtifactResponse
- GetAllArtifactFilesResponse
- GetArtifactFileResponseJSONResponse
- GetArtifactFilesMetadata
- GetQuarantinePathJSONResponse
- getCheckSums
- GetAllArtifactByRegistryResponse
- GetAllArtifactLabelsResponse
- GetAllArtifactVersionResponse
- GetNonOCIAllArtifactVersionResponse
- GetNonOCIArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: base.go]---
Location: harness-main/registry/app/api/controller/metadata/base.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryRequestInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryRequestInfo
- RegistryRequestParams
- ArtifactFilesRequestInfo
- manifestConfig
- historyEntry
- rootFS
- GetRegistryRequestInfo
- getManifestConfig
- setUpstreamProxyIDs
- assertNoCycleOnAdd
- assertNoCycleOnAddHelper
- getUpstreamProxyIDs
- getUpstreamProxyKeys
- getRepoEntityFields
- CreateVirtualRepositoryResponse
- CreateUpstreamProxyResponseJSONResponse
- deduplicateTriggers
- GetArtifactFilesRequestInfo
```

--------------------------------------------------------------------------------

---[FILE: cleanuppolicy_mapper.go]---
Location: harness-main/registry/app/api/controller/metadata/cleanuppolicy_mapper.go
Signals: N/A
Excerpt (<=80 chars):  func CreateCleanupPolicyEntity(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCleanupPolicyEntity
- CreateCleanupPolicyResponse
- getCleanupPolicyEntity
- getCleanupPolicyDto
```

--------------------------------------------------------------------------------

---[FILE: cleanuppolicy_mapper_test.go]---
Location: harness-main/registry/app/api/controller/metadata/cleanuppolicy_mapper_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestCreateCleanupPolicyEntity_FunctionExists(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCreateCleanupPolicyEntity_FunctionExists
- TestCreateCleanupPolicyResponse_FunctionExists
- TestGetCleanupPolicyEntity_FunctionExists
- TestGetCleanupPolicyDto_FunctionExists
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/metadata/controller.go
Signals: N/A
Excerpt (<=80 chars): type APIController struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APIController
- NewAPIController
```

--------------------------------------------------------------------------------

---[FILE: create_quarantine_file_path.go]---
Location: harness-main/registry/app/api/controller/metadata/create_quarantine_file_path.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) QuarantineFilePath(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QuarantineFilePath
```

--------------------------------------------------------------------------------

---[FILE: create_registry.go]---
Location: harness-main/registry/app/api/controller/metadata/create_registry.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) CreateRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRegistry
- createVirtualRegistry
- createUpstreamProxyWithAudit
- createRegistryWithAudit
- throwCreateRegistry400Error
- CreateRegistryEntity
- CreateUpstreamProxyEntity
- isDuplicateKeyError
- handleDuplicateRegistryError
```

--------------------------------------------------------------------------------

---[FILE: create_registry_test.go]---
Location: harness-main/registry/app/api/controller/metadata/create_registry_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestCreateRegistry(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCreateRegistry
```

--------------------------------------------------------------------------------

---[FILE: create_webhook.go]---
Location: harness-main/registry/app/api/controller/metadata/create_webhook.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) CreateWebhook(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWebhook
- createWebhookBadRequestErrorResponse
- createWebhookInternalErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: create_webhook_test.go]---
Location: harness-main/registry/app/api/controller/metadata/create_webhook_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestCreateWebhook(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCreateWebhook
```

--------------------------------------------------------------------------------

---[FILE: delete_artifact.go]---
Location: harness-main/registry/app/api/controller/metadata/delete_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) DeleteArtifact(ctx context.Context, r artifact.Delet...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteArtifact
- deleteOCIImage
- deleteGenericImage
- throwDeleteArtifact500Error
```

--------------------------------------------------------------------------------

---[FILE: delete_artifacts_version.go]---
Location: harness-main/registry/app/api/controller/metadata/delete_artifacts_version.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) DeleteArtifactVersion(ctx context.Context, r artifac...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteArtifactVersion
- deleteOciVersionWithAudit
- deleteVersion
- sendArtifactDeletedWebhookEvent
- throwDeleteArtifactVersion500Error
- getTagDigest
```

--------------------------------------------------------------------------------

---[FILE: delete_artifact_test.go]---
Location: harness-main/registry/app/api/controller/metadata/delete_artifact_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestDeleteArtifact(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDeleteArtifact
```

--------------------------------------------------------------------------------

---[FILE: delete_quarantine_file_path.go]---
Location: harness-main/registry/app/api/controller/metadata/delete_quarantine_file_path.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) DeleteQuarantineFilePath(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteQuarantineFilePath
```

--------------------------------------------------------------------------------

---[FILE: delete_registry.go]---
Location: harness-main/registry/app/api/controller/metadata/delete_registry.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) DeleteRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteRegistry
- checkIfRegistryUsedAsUpstream
- deleteRegistryWithAudit
- throwDeleteRegistry500Error
```

--------------------------------------------------------------------------------

---[FILE: delete_registry_test.go]---
Location: harness-main/registry/app/api/controller/metadata/delete_registry_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestDeleteRegistry(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDeleteRegistry
```

--------------------------------------------------------------------------------

---[FILE: delete_webhook.go]---
Location: harness-main/registry/app/api/controller/metadata/delete_webhook.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) DeleteWebhook(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteWebhook
- deleteWebhookInternalErrorResponse
- deleteWebhookBadRequestErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetAllArtifacts(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetAllArtifacts
- enrichArtifactsWithQuarantineInfo
- getAllArtifacts400JsonResponse
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_docker_details.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_docker_details.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetDockerArtifactDetails(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetDockerArtifactDetails
- getArtifactDetailsErrResponse
- isDockerVersionTag
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_docker_layers.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_docker_layers.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetDockerArtifactLayers(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetDockerArtifactLayers
- getLayersErrorResponse
- getManifestLayers
- GetSizeString
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_docker_manifest.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_docker_manifest.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetDockerArtifactManifest(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetDockerArtifactManifest
- getArtifactManifestErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_docker_manifests.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_docker_manifests.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetDockerArtifactManifests(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetDockerArtifactManifests
- getManifestList
- artifactManifestsErrorRs
- getManifestDetails
- ProcessManifest
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_helm_details.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_helm_details.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetHelmArtifactDetails(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetHelmArtifactDetails
- getHelmArtifactDetailsErrResponse
- isHelmVersionTag
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_helm_manifest.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_helm_manifest.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetHelmArtifactManifest(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetHelmArtifactManifest
- get400Error
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_labels.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_labels.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) ListArtifactLabels(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListArtifactLabels
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_summary.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_summary.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetArtifactSummary(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactSummary
- getImageMetadata
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_test.go
Signals: N/A
Excerpt (<=80 chars): func TestGetAllArtifacts(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetAllArtifacts
- TestGetAllArtifactsSnapshot
- setupArtifactsControllerWithError
- setupArtifactsSnapshotController
- verifyArtifactsSnapshot
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_versions.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_versions.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetAllArtifactVersions(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetAllArtifactVersions
- updateQuarantineInfo
- setDigestCount
- setDigestCountInTagMetadata
- throw500Error
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_versions_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_versions_test.go
Signals: N/A
Excerpt (<=80 chars): func TestGetAllArtifactVersions(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetAllArtifactVersions
- TestGetAllArtifactVersionsSnapshot
- setupVersionsController
- setupVersionsControllerWithError
- setupVersionsSnapshotController
- verifyVersionsSnapshot
```

--------------------------------------------------------------------------------

---[FILE: get_artifacts_version_summary.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifacts_version_summary.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetArtifactVersionSummary(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactVersionSummary
- FetchArtifactSummary
```

--------------------------------------------------------------------------------

---[FILE: get_artifact_detail.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifact_detail.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetArtifactDetails(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactDetails
```

--------------------------------------------------------------------------------

---[FILE: get_artifact_detail_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifact_detail_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetArtifactDetails(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetArtifactDetails
- setupBasicController
- setupControllerWithError
- TestGetArtifactDetailsSnapshot
- setupSnapshotController
- verifyArtifactSnapshot
```

--------------------------------------------------------------------------------

---[FILE: get_artifact_file.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifact_file.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetArtifactFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactFile
```

--------------------------------------------------------------------------------

---[FILE: get_artifact_files.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifact_files.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetArtifactFiles(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactFiles
- failedToFetchFilesResponse
```

--------------------------------------------------------------------------------

---[FILE: get_artifact_files_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifact_files_test.go
Signals: N/A
Excerpt (<=80 chars): func TestGetArtifactFiles(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetArtifactFiles
- TestGetArtifactFilesSnapshot
- setupFilesController
- setupFilesControllerWithError
- setupFilesSnapshotController
- verifyFilesSnapshot
```

--------------------------------------------------------------------------------

---[FILE: get_artifact_stats.go]---
Location: harness-main/registry/app/api/controller/metadata/get_artifact_stats.go
Signals: N/A
Excerpt (<=80 chars): func (c *APIController) GetArtifactStats(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactStats
- GetArtifactStatsForSpace
- GetArtifactStatsForRegistry
```

--------------------------------------------------------------------------------

---[FILE: get_client_setup_details.go]---
Location: harness-main/registry/app/api/controller/metadata/get_client_setup_details.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetClientSetupDetails(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetClientSetupDetails
- GenerateClientSetupDetails
- generateDockerClientSetupDetail
- getAnonymousDockerClientSetupDetails
- getDockerClientSetupDetails
- generateGenericClientSetupDetail
- getAnonymousGenericClientSetupDetails
- getGenericClientSetupDetails
- generateHelmClientSetupDetail
- getAnonymousHelmClientSetupDetails
- getHelmClientSetupDetails
- generateMavenClientSetupDetail
- getAnonymousMavenClientSetupDetails
- getMavenClientSetupDetails
- generateRpmClientSetupDetail
- getRpmClientSetupDetails
- getAnonymousRpmClientSetupDetails
- generatePythonClientSetupDetail
```

--------------------------------------------------------------------------------

---[FILE: get_client_setup_details_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_client_setup_details_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetClientSetupDetails(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetClientSetupDetails
- TestGenerateClientSetupDetails
- TestGenerateClientSetupDetails_WithUntaggedImages
- TestGenerateClientSetupDetails_MavenWithGroupID
- createFileManager
- createEventReporter
- setupControllerForPackageType
- setupControllerForError
- TestGenerateClientSetupDetailsSnapshot
- verifySnapshot
```

--------------------------------------------------------------------------------

---[FILE: get_oci_artifacts_tags.go]---
Location: harness-main/registry/app/api/controller/metadata/get_oci_artifacts_tags.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetOciArtifactTags(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetOciArtifactTags
- getOciArtifactTagsBadRequestResponse
- getOCIArtifacts500Error
- getOCIArtifacts404Error
```

--------------------------------------------------------------------------------

---[FILE: get_registries.go]---
Location: harness-main/registry/app/api/controller/metadata/get_registries.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetAllRegistries(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetAllRegistries
- GetAllRegistryResponse
- GetRegistryMetadata
- GetRegistryPath
```

--------------------------------------------------------------------------------

---[FILE: get_registries_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_registries_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetAllRegistryResponse(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetAllRegistryResponse
- TestGetRegistryMetadata
- TestGetRegistryPath
```

--------------------------------------------------------------------------------

---[FILE: get_registry.go]---
Location: harness-main/registry/app/api/controller/metadata/get_registry.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRegistry
- throwGetRegistry500Error
```

--------------------------------------------------------------------------------

---[FILE: get_registry_artifacts.go]---
Location: harness-main/registry/app/api/controller/metadata/get_registry_artifacts.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetAllArtifactsByRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetAllArtifactsByRegistry
- enrichArtifactWithQuarantineInfo
- getAllArtifactsByRegistry400JsonResponse
```

--------------------------------------------------------------------------------

---[FILE: get_registry_artifacts_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_registry_artifacts_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetAllArtifactByRegistryResponse(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetAllArtifactByRegistryResponse
- TestGetRegistryArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: get_webhook_details.go]---
Location: harness-main/registry/app/api/controller/metadata/get_webhook_details.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetWebhook(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetWebhook
- getWebhookInternalErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: get_webhook_execution.go]---
Location: harness-main/registry/app/api/controller/metadata/get_webhook_execution.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) GetWebhookExecution(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetWebhookExecution
- getWebhooksExecutionsInternalErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: get_webhook_execution_test.go]---
Location: harness-main/registry/app/api/controller/metadata/get_webhook_execution_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetWebhookExecution(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetWebhookExecution
```

--------------------------------------------------------------------------------

---[FILE: list_webhooks.go]---
Location: harness-main/registry/app/api/controller/metadata/list_webhooks.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) ListWebhooks(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListWebhooks
- listWebhookInternalErrorResponse
- mapToListWebhookResponseEntity
```

--------------------------------------------------------------------------------

---[FILE: list_webhook_execution.go]---
Location: harness-main/registry/app/api/controller/metadata/list_webhook_execution.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) ListWebhookExecutions(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListWebhookExecutions
- listWebhooksExecutionsInternalErrorResponse
- mapToAPIListWebhooksExecutions
- MapToWebhookExecutionResponseEntity
- mapTpAPIExecutionResult
- mapTpAPITriggerType
```

--------------------------------------------------------------------------------

---[FILE: list_webhook_execution_test.go]---
Location: harness-main/registry/app/api/controller/metadata/list_webhook_execution_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestListWebhookExecutions(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestListWebhookExecutions
- TestMapToWebhookExecutionResponseEntity_Table
- createTestWebhookExecution
```

--------------------------------------------------------------------------------

---[FILE: registry_metadata_helper.go]---
Location: harness-main/registry/app/api/controller/metadata/registry_metadata_helper.go
Signals: N/A
Excerpt (<=80 chars):  type GitnessRegistryMetadataHelper struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitnessRegistryMetadataHelper
- NewRegistryMetadataHelper
- GetSecretSpaceID
- GetRegistryRequestBaseInfo
- GetPermissionChecks
- MapToWebhookCore
- mapToDTOHeaders
- MapToWebhookResponseEntity
- MapToInternalWebhookTriggers
- MapToAPIExecutionResult
- MapToAPIWebhookTriggers
- MapToAPIExtraHeaders
```

--------------------------------------------------------------------------------

---[FILE: registry_metadata_helper_test.go]---
Location: harness-main/registry/app/api/controller/metadata/registry_metadata_helper_test.go
Signals: N/A
Excerpt (<=80 chars): func stringPtr(s string) *string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stringPtr
- TestMapToWebhook
- TestMapToWebhook_WithSecretSpacePath
- TestMapToWebhook_WithInexistentSecretSpacePath
- TestMapToWebhookResponseEntity
- TestMapToWebhookResponseEntity_FindByPathError
- TestGetRegistryRequestBaseInfo
- TestMapToInternalWebhookTriggers
- TestMapToAPIWebhookTriggers
```

--------------------------------------------------------------------------------

---[FILE: replication.go]---
Location: harness-main/registry/app/api/controller/metadata/replication.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) ListReplicationRules(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListReplicationRules
- CreateReplicationRule
- DeleteReplicationRule
- GetReplicationRule
- UpdateReplicationRule
- ListMigrationImages
- GetMigrationLogsForImage
- StartMigration
- StopMigration
```

--------------------------------------------------------------------------------

---[FILE: retrigger_webhook_execution.go]---
Location: harness-main/registry/app/api/controller/metadata/retrigger_webhook_execution.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) ReTriggerWebhookExecution(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReTriggerWebhookExecution
- getReTriggerWebhooksExecutionsInternalErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: retrigger_webhook_execution_test.go]---
Location: harness-main/registry/app/api/controller/metadata/retrigger_webhook_execution_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestReTriggerWebhookExecution(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestReTriggerWebhookExecution
```

--------------------------------------------------------------------------------

---[FILE: update_artifact.go]---
Location: harness-main/registry/app/api/controller/metadata/update_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) UpdateArtifactLabels(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateArtifactLabels
- throwModifyArtifact400Error
- AttachLabels
- getArtifactSummary
```

--------------------------------------------------------------------------------

---[FILE: update_registry.go]---
Location: harness-main/registry/app/api/controller/metadata/update_registry.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) ModifyRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModifyRegistry
- updateVirtualRegistry
- updateUpstreamProxyWithAudit
- updateRegistryWithAudit
- updatePublicAccess
- throwModifyRegistry500Error
- updateCleanupPolicy
- UpdateRepoEntity
- UpdateUpstreamProxyEntity
- checkIfUpstreamIsUsedInPublicRegistries
- checkIfVirtualHasPrivateUpstreams
```

--------------------------------------------------------------------------------

---[FILE: update_webhook.go]---
Location: harness-main/registry/app/api/controller/metadata/update_webhook.go
Signals: N/A
Excerpt (<=80 chars):  func (c *APIController) UpdateWebhook(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateWebhook
- updateWebhookInternalErrorResponse
- updateWebhookBadRequestErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/api/controller/metadata/utils.go
Signals: N/A
Excerpt (<=80 chars):  func ValidateScope(scope string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateScope
- ValidateAndGetArtifactType
- ValidatePackageTypeChange
- ValidateRepoTypeChange
- ValidateIdentifierChange
- ValidateIdentifier
- ValidateUpstream
- IsScopeValid
- GetTimeInMs
- GetErrorResponse
- GetSortByOrder
- sortKey
- GetSortByField
- GetPageLimit
- GetOffset
- GetPageNumber
- GetSuccessResponse
- GetPageCount
```

--------------------------------------------------------------------------------

````
