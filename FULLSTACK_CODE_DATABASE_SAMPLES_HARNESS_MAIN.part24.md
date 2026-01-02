---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 24
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 24 of 37)

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

---[FILE: garbagecollector.go]---
Location: harness-main/registry/gc/garbagecollector.go
Signals: N/A
Excerpt (<=80 chars):  type Noop struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Noop
- New
- Start
- BlobFindAndLockBefore
- BlobReschedule
- ManifestFindAndLockBefore
- ManifestFindAndLockNBefore
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/gc/wire.go
Signals: N/A
Excerpt (<=80 chars):  func StorageDeleterProvider(driver storagedriver.StorageDriver) storagedrive...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StorageDeleterProvider
- ServiceProvider
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/job/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideJobRpmRegistryIndex(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideJobRpmRegistryIndex
```

--------------------------------------------------------------------------------

---[FILE: rpm_registry_index.go]---
Location: harness-main/registry/job/handler/rpm_registry_index.go
Signals: N/A
Excerpt (<=80 chars):  type JobRpmRegistryIndex struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobRpmRegistryIndex
- RegistrySyncInput
- NewJobRpmRegistryIndex
- Handle
- getJobInput
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/registry/request/context.go
Signals: N/A
Excerpt (<=80 chars):  type contextKey string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OriginalPathFrom
- WithOriginalPath
- OriginalURLFrom
- WithOriginalURL
- ArtifactInfoFrom
- WithArtifactInfo
```

--------------------------------------------------------------------------------

---[FILE: rpm_helper.go]---
Location: harness-main/registry/services/asyncprocessing/rpm_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RpmHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RpmHelper
- registryData
- localRepoData
- remoteRepoData
- getReader
- getFileRef
- NewRpmHelper
- BuildRegistryFiles
- buildForVirtual
- buildForUpstream
- getRegistryData
- getExistingArtifactInfos
- buildRepoMDFile
- getRefsForHarnessRepos
- getRefs
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/registry/services/asyncprocessing/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- NewService
- Prepare
- handleEventExecuteAsyncTask
- handleBuildRegistryIndex
- handleBuildPackageIndex
- handleBuildPackageMetadata
- finalStatusUpdate
- ProcessingStatusUpdate
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/services/asyncprocessing/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
- ProvideRegistryPostProcessingConfig
- ProvideRpmHelper
```

--------------------------------------------------------------------------------

---[FILE: handler_artifact.go]---
Location: harness-main/registry/services/webhook/handler_artifact.go
Signals: N/A
Excerpt (<=80 chars): type ArtifactEventPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactEventPayload
- RegistryInfo
- handleEventArtifactCreated
- handleEventArtifactDeleted
- getArtifactInfo
- triggerForEventWithArtifact
- getParentInfoRegistry
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/registry/services/webhook/helper.go
Signals: N/A
Excerpt (<=80 chars):  func GetArtifactCreatedPayload(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifactCreatedPayload
- GetArtifactDeletedPayload
- GetArtifactCreatedPayloadForCommonArtifacts
- GetArtifactDeletedPayloadForCommonArtifacts
- GetRepoURLWithoutProtocol
```

--------------------------------------------------------------------------------

---[FILE: interface.go]---
Location: harness-main/registry/services/webhook/interface.go
Signals: N/A
Excerpt (<=80 chars): type ServiceInterface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServiceInterface
```

--------------------------------------------------------------------------------

---[FILE: repository.go]---
Location: harness-main/registry/services/webhook/repository.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryWebhookExecutorStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryWebhookExecutorStore
- Find
- ListWebhooks
- ListForTrigger
- CreateWebhookExecution
- UpdateOptLock
- FindWebhook
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/registry/services/webhook/service.go
Signals: N/A
Excerpt (<=80 chars): type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- ReTriggerWebhookExecution
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/services/webhook/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: 00_conformance_suite_test.go]---
Location: harness-main/registry/tests/cargo/00_conformance_suite_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestCargoConformance(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCargoConformance
- SkipIfDisabled
```

--------------------------------------------------------------------------------

---[FILE: 02_upload_test.go]---
Location: harness-main/registry/tests/cargo/02_upload_test.go
Signals: N/A
Excerpt (<=80 chars):  type packageIndexMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- packageIndexMetadata
- generateCargoPackagePayload
- getIndexFilePathFromImageName
- getPackageIndexContentFromText
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/registry/tests/cargo/config.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- InitConfig
- IsTestEnabled
- getEnv
- GetUniqueVersion
- GetUniqueArtifactName
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/registry/tests/cargo/reporter.go
Signals: N/A
Excerpt (<=80 chars): type TestResult struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestResult
- TestReport
- ReporterHook
- ReportTest
- SaveReport
- SuiteWillBegin
- SuiteDidEnd
- SpecDidComplete
```

--------------------------------------------------------------------------------

---[FILE: reporter_init.go]---
Location: harness-main/registry/tests/cargo/reporter_init.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: 00_conformance_suite_test.go]---
Location: harness-main/registry/tests/gopkg/00_conformance_suite_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGoPkgConformance(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGoPkgConformance
- SkipIfDisabled
```

--------------------------------------------------------------------------------

---[FILE: 02_upload_test.go]---
Location: harness-main/registry/tests/gopkg/02_upload_test.go
Signals: N/A
Excerpt (<=80 chars):  type UploadFormData struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadFormData
- PackageInfo
- generateGoPackagePayload
- addFile
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/registry/tests/gopkg/config.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- InitConfig
- IsTestEnabled
- getEnv
- GetUniqueVersion
- GetUniqueArtifactName
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/registry/tests/gopkg/reporter.go
Signals: N/A
Excerpt (<=80 chars): type TestResult struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestResult
- TestReport
- ReporterHook
- ReportTest
- SaveReport
- SuiteWillBegin
- SuiteDidEnd
- SpecDidComplete
```

--------------------------------------------------------------------------------

---[FILE: reporter_init.go]---
Location: harness-main/registry/tests/gopkg/reporter_init.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: 00_conformance_suite_test.go]---
Location: harness-main/registry/tests/maven/00_conformance_suite_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestMavenConformance(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestMavenConformance
- SkipIfDisabled
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/registry/tests/maven/config.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- InitConfig
- IsTestEnabled
- getEnv
- GetUniqueVersion
- GetUniqueArtifactName
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/registry/tests/maven/reporter.go
Signals: N/A
Excerpt (<=80 chars): type TestResult struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestResult
- TestReport
- ReporterHook
- ReportTest
- SaveReport
- SuiteWillBegin
- SuiteDidEnd
- SpecDidComplete
```

--------------------------------------------------------------------------------

---[FILE: reporter_init.go]---
Location: harness-main/registry/tests/maven/reporter_init.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: 00_conformance_suite_test.go]---
Location: harness-main/registry/tests/npm/00_conformance_suite_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNpmConformance(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNpmConformance
- SkipIfDisabled
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/registry/tests/npm/config.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- InitConfig
- IsTestEnabled
- getEnv
- GetUniqueVersion
- GetUniquePackageName
- GetUniqueScopedPackageName
```

--------------------------------------------------------------------------------

---[FILE: helpers.go]---
Location: harness-main/registry/tests/npm/helpers.go
Signals: N/A
Excerpt (<=80 chars): func generateNpmPackagePayload(packageName, version string, isScoped bool, sc...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateNpmPackagePayload
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/registry/tests/npm/reporter.go
Signals: N/A
Excerpt (<=80 chars): type TestResult struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestResult
- TestReport
- ReporterHook
- ReportTest
- SaveReport
- SuiteWillBegin
- SuiteDidEnd
- SpecDidComplete
```

--------------------------------------------------------------------------------

---[FILE: reporter_init.go]---
Location: harness-main/registry/tests/npm/reporter_init.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/registry/tests/utils/client.go
Signals: N/A
Excerpt (<=80 chars): type Client struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Client
- Request
- Response
- ReaderFile
- NewClient
- NewRequest
- SetHeader
- SetBody
- Close
- NewReaderFile
- Do
```

--------------------------------------------------------------------------------

---[FILE: artifact.go]---
Location: harness-main/registry/types/artifact.go
Signals: N/A
Excerpt (<=80 chars): type Artifact struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Artifact
- NonOCIArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: bandwidth_stat.go]---
Location: harness-main/registry/types/bandwidth_stat.go
Signals: N/A
Excerpt (<=80 chars): type BandwidthStat struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BandwidthStat
```

--------------------------------------------------------------------------------

---[FILE: blob.go]---
Location: harness-main/registry/types/blob.go
Signals: N/A
Excerpt (<=80 chars): type Blob struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Blob
```

--------------------------------------------------------------------------------

---[FILE: cleanuppolicy.go]---
Location: harness-main/registry/types/cleanuppolicy.go
Signals: N/A
Excerpt (<=80 chars): type CleanupPolicy struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CleanupPolicy
- CleanupPolicyPrefix
```

--------------------------------------------------------------------------------

---[FILE: configuration.go]---
Location: harness-main/registry/types/configuration.go
Signals: N/A
Excerpt (<=80 chars):  type Configuration struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Configuration
```

--------------------------------------------------------------------------------

---[FILE: digest.go]---
Location: harness-main/registry/types/digest.go
Signals: N/A
Excerpt (<=80 chars): type Digest string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetDigestBytes
- GetHexDecodedBytes
- String
- NewDigest
- Parse
- validate
- HexDecode
```

--------------------------------------------------------------------------------

---[FILE: download_stat.go]---
Location: harness-main/registry/types/download_stat.go
Signals: N/A
Excerpt (<=80 chars): type DownloadStat struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadStat
```

--------------------------------------------------------------------------------

---[FILE: filter_params.go]---
Location: harness-main/registry/types/filter_params.go
Signals: N/A
Excerpt (<=80 chars):  type SortOrder string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterParams
```

--------------------------------------------------------------------------------

---[FILE: gc.go]---
Location: harness-main/registry/types/gc.go
Signals: N/A
Excerpt (<=80 chars):  type GCBlobTask struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GCBlobTask
- GCManifestTask
```

--------------------------------------------------------------------------------

---[FILE: generic_blob.go]---
Location: harness-main/registry/types/generic_blob.go
Signals: N/A
Excerpt (<=80 chars):  type GenericBlob struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericBlob
- FileInfo
```

--------------------------------------------------------------------------------

---[FILE: image.go]---
Location: harness-main/registry/types/image.go
Signals: N/A
Excerpt (<=80 chars): type Image struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Image
```

--------------------------------------------------------------------------------

---[FILE: jsonb.go]---
Location: harness-main/registry/types/jsonb.go
Signals: N/A
Excerpt (<=80 chars):  type JSONB map[string]string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Scan
```

--------------------------------------------------------------------------------

---[FILE: layer.go]---
Location: harness-main/registry/types/layer.go
Signals: N/A
Excerpt (<=80 chars): type Layer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Layer
```

--------------------------------------------------------------------------------

---[FILE: manifest.go]---
Location: harness-main/registry/types/manifest.go
Signals: N/A
Excerpt (<=80 chars): type Manifest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Manifest
```

--------------------------------------------------------------------------------

---[FILE: manifest_reference.go]---
Location: harness-main/registry/types/manifest_reference.go
Signals: N/A
Excerpt (<=80 chars): type ManifestReference struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManifestReference
```

--------------------------------------------------------------------------------

---[FILE: media_type.go]---
Location: harness-main/registry/types/media_type.go
Signals: N/A
Excerpt (<=80 chars): type MediaType struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MediaType
```

--------------------------------------------------------------------------------

---[FILE: node.go]---
Location: harness-main/registry/types/node.go
Signals: N/A
Excerpt (<=80 chars):  type Node struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Node
- FileNodeMetadata
```

--------------------------------------------------------------------------------

---[FILE: oci_Image_index_mapping.go]---
Location: harness-main/registry/types/oci_Image_index_mapping.go
Signals: N/A
Excerpt (<=80 chars):  type OCIImageIndexMapping struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OCIImageIndexMapping
```

--------------------------------------------------------------------------------

---[FILE: PackageTag.go]---
Location: harness-main/registry/types/PackageTag.go
Signals: N/A
Excerpt (<=80 chars):  type PackageTag struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageTag
- PackageTagMetadata
```

--------------------------------------------------------------------------------

---[FILE: quarantine_artifact.go]---
Location: harness-main/registry/types/quarantine_artifact.go
Signals: N/A
Excerpt (<=80 chars): type QuarantineArtifact struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QuarantineArtifact
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/types/registry.go
Signals: N/A
Excerpt (<=80 chars): type RegistryConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryConfig
- Registry
- Identifier
```

--------------------------------------------------------------------------------

---[FILE: registry_root_ref_key.go]---
Location: harness-main/registry/types/registry_root_ref_key.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryRootRefCacheKey struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryRootRefCacheKey
```

--------------------------------------------------------------------------------

---[FILE: request.go]---
Location: harness-main/registry/types/request.go
Signals: N/A
Excerpt (<=80 chars): type RegistryRequestBaseInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryRequestBaseInfo
- ArtifactFilesRequestInfo
```

--------------------------------------------------------------------------------

---[FILE: tag.go]---
Location: harness-main/registry/types/tag.go
Signals: N/A
Excerpt (<=80 chars): type Tag struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tag
- ArtifactMetadata
- ImageMetadata
- OciVersionMetadata
- TagDetail
- TagInfo
- QuarantineInfo
- ArtifactIdentifier
```

--------------------------------------------------------------------------------

---[FILE: task.go]---
Location: harness-main/registry/types/task.go
Signals: N/A
Excerpt (<=80 chars):  type TaskStatus string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Task
- TaskSource
- TaskEvent
- SourceRef
- BuildRegistryIndexTaskPayload
- BuildPackageIndexTaskPayload
- BuildPackageMetadataTaskPayload
```

--------------------------------------------------------------------------------

---[FILE: upstream_proxy_config.go]---
Location: harness-main/registry/types/upstream_proxy_config.go
Signals: N/A
Excerpt (<=80 chars): type UpstreamProxyConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpstreamProxyConfig
- UpstreamProxy
```

--------------------------------------------------------------------------------

---[FILE: pointer_helpers.go]---
Location: harness-main/registry/utils/pointer_helpers.go
Signals: N/A
Excerpt (<=80 chars): func StringPtr(s string) *string { return &s }

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StringPtr
- Int64Ptr
- IntPtr
- BoolPtr
- Int32Ptr
- WebhookExecResultPtr
- WebhookTriggerPtr
- PageSizePtr
- PageNumberPtr
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/utils/utils.go
Signals: N/A
Excerpt (<=80 chars):  func HasAnyPrefix(s string, prefixes []string) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HasAnyPrefix
- HasAnySuffix
- SafeUint64
- IsEmpty
- GetParsedDigest
```

--------------------------------------------------------------------------------

---[FILE: helpers.go]---
Location: harness-main/registry/validation/helpers.go
Signals: N/A
Excerpt (<=80 chars): func IsValidURL(uri string) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IsValidURL
- validPort
- portOnly
```

--------------------------------------------------------------------------------

---[FILE: embed.go]---
Location: harness-main/resources/embed.go
Signals: N/A
Excerpt (<=80 chars): func Licenses() ([]byte, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Licenses
- ReadLicense
- GitIgnores
- ReadGitIgnore
```

--------------------------------------------------------------------------------

---[FILE: embed_test.go]---
Location: harness-main/resources/embed_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestLicenses(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestLicenses
- TestReadLicense
- TestGitIgnores
- TestReadGitIgnore
- TestReadGitIgnoreContent
- TestLicensesNotEmpty
- TestReadLicenseFormat
- TestGitIgnoresUnique
- minInt
```

--------------------------------------------------------------------------------

---[FILE: log.go]---
Location: harness-main/ssh/log.go
Signals: N/A
Excerpt (<=80 chars):  func getRequestID(reqID string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRequestID
- getLoggerWithRequestID
```

--------------------------------------------------------------------------------

---[FILE: middleware.go]---
Location: harness-main/ssh/middleware.go
Signals: N/A
Excerpt (<=80 chars):  type Middleware func(ssh.Handler) ssh.Handler

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChainMiddleware
- PanicRecoverMiddleware
- HLogAccessLogHandler
- HLogRequestIDHandler
- ChainPublicKeyMiddleware
- LogPublicKeyMiddleware
- getLogger
```

--------------------------------------------------------------------------------

---[FILE: server.go]---
Location: harness-main/ssh/server.go
Signals: N/A
Excerpt (<=80 chars):  type contextKey string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Server
- sanitize
- ListenAndServe
- setupHostKeys
- Shutdown
- sessionHandler
- sendKeepAliveMsg
- publicKeyHandler
- sshConnectionFailed
- CreateKeyIfNotExists
- GenerateKeyPair
- getRepoRefFromCommand
- writeErrorToSession
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/ssh/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideServer(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideServer
```

--------------------------------------------------------------------------------

---[FILE: errors_test.go]---
Location: harness-main/store/errors_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestErrors(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestErrors
- TestErrorsAreDistinct
- TestErrorsCanBeCompared
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/store/database/config.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: store.go]---
Location: harness-main/store/database/store.go
Signals: N/A
Excerpt (<=80 chars):  type Migrator func(ctx context.Context, dbx *sqlx.DB) error

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Connect
- ConnectAndMigrate
- Must
- prepareDatasourceForDriver
- pingDatabase
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/store/database/util.go
Signals: N/A
Excerpt (<=80 chars): func Limit(size int) uint64 {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Limit
- Offset
- ProcessSQLErrorf
```

--------------------------------------------------------------------------------

---[FILE: util_no_sqlite.go]---
Location: harness-main/store/database/util_no_sqlite.go
Signals: N/A
Excerpt (<=80 chars):  func isSQLUniqueConstraintError(original error) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isSQLUniqueConstraintError
- isSQLForeignKeyViolationError
```

--------------------------------------------------------------------------------

---[FILE: util_sqlite.go]---
Location: harness-main/store/database/util_sqlite.go
Signals: N/A
Excerpt (<=80 chars):  func isSQLUniqueConstraintError(original error) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isSQLUniqueConstraintError
- isSQLForeignKeyViolationError
```

--------------------------------------------------------------------------------

---[FILE: util_test.go]---
Location: harness-main/store/database/util_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestOffset(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestOffset
- TestLimit
- TestProcessSQLErrorf
```

--------------------------------------------------------------------------------

---[FILE: ctx.go]---
Location: harness-main/store/database/dbtx/ctx.go
Signals: N/A
Excerpt (<=80 chars): type ctxKeyTx struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ctxKeyTx
- GetAccessor
- GetTransaction
```

--------------------------------------------------------------------------------

---[FILE: db.go]---
Location: harness-main/store/database/dbtx/db.go
Signals: N/A
Excerpt (<=80 chars): func New(db *sqlx.DB) AccessorTx {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- transactor
- sqlDB
- New
- startTx
```

--------------------------------------------------------------------------------

---[FILE: interface.go]---
Location: harness-main/store/database/dbtx/interface.go
Signals: N/A
Excerpt (<=80 chars): type Accessor interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Accessor
- Transaction
- Transactor
- AccessorTx
- TransactionAccessor
```

--------------------------------------------------------------------------------

---[FILE: locker.go]---
Location: harness-main/store/database/dbtx/locker.go
Signals: N/A
Excerpt (<=80 chars):  type locker interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- locker
- lockerNop
- needsLocking
- getLocker
- RLock
- RUnlock
- Lock
- Unlock
```

--------------------------------------------------------------------------------

---[FILE: runner.go]---
Location: harness-main/store/database/dbtx/runner.go
Signals: N/A
Excerpt (<=80 chars): type runnerDB struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- runnerDB
- runnerTx
- WithTx
- DriverName
- Rebind
- BindNamed
- QueryContext
- QueryxContext
- QueryRowxContext
- ExecContext
- QueryRowContext
- PrepareContext
- PreparexContext
- PrepareNamedContext
- GetContext
- SelectContext
- Commit
- Rollback
```

--------------------------------------------------------------------------------

---[FILE: runner_test.go]---
Location: harness-main/store/database/dbtx/runner_test.go
Signals: N/A
Excerpt (<=80 chars): func TestWithTx(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dbMock
- txMock
- lockerCounter
- dbMockNop
- TestWithTx
- startTx
- Commit
- Rollback
- TestLocking
- Lock
- Unlock
- RLock
- RUnlock
- DriverName
- Rebind
- BindNamed
- QueryContext
- QueryxContext
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/store/database/dbtx/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideAccessorTx(db *sqlx.DB) AccessorTx {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideAccessorTx
- ProvideAccessor
- ProvideTransactor
```

--------------------------------------------------------------------------------

---[FILE: memory_broker.go]---
Location: harness-main/stream/memory_broker.go
Signals: N/A
Excerpt (<=80 chars): type MemoryBroker struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryBroker
- NewMemoryBroker
- enqueue
- messages
```

--------------------------------------------------------------------------------

---[FILE: memory_consumer.go]---
Location: harness-main/stream/memory_consumer.go
Signals: N/A
Excerpt (<=80 chars): type memoryMessage struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- memoryMessage
- MemoryConsumer
- NewMemoryConsumer
- Configure
- Register
- Start
- reader
- consume
- processMessage
- retryPostTimeout
- retryMessage
- Errors
- Infos
- pushError
```

--------------------------------------------------------------------------------

---[FILE: memory_producer.go]---
Location: harness-main/stream/memory_producer.go
Signals: N/A
Excerpt (<=80 chars): type MemoryProducer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryProducer
- NewMemoryProducer
- Send
```

--------------------------------------------------------------------------------

---[FILE: options.go]---
Location: harness-main/stream/options.go
Signals: N/A
Excerpt (<=80 chars): type ConsumerOption interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConsumerOption
- HandlerOption
- apply
- WithConcurrency
- WithHandlerOptions
- WithMaxRetries
- WithIdleTimeout
```

--------------------------------------------------------------------------------

---[FILE: options_test.go]---
Location: harness-main/stream/options_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestWithConcurrency(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestWithConcurrency
- TestWithMaxRetries
- TestWithIdleTimeout
- TestWithHandlerOptions
```

--------------------------------------------------------------------------------

---[FILE: redis_consumer.go]---
Location: harness-main/stream/redis_consumer.go
Signals: N/A
Excerpt (<=80 chars): type RedisConsumer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RedisConsumer
- NewRedisConsumer
- Configure
- Register
- Start
- reader
- reclaimer
- consumer
- removeStaleConsumers
- pushError
- pushInfo
- Errors
- Infos
- createGroupForAllStreams
- createGroup
```

--------------------------------------------------------------------------------

---[FILE: redis_producer.go]---
Location: harness-main/stream/redis_producer.go
Signals: N/A
Excerpt (<=80 chars):  type RedisProducer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RedisProducer
- NewRedisProducer
- Send
```

--------------------------------------------------------------------------------

---[FILE: stream.go]---
Location: harness-main/stream/stream.go
Signals: N/A
Excerpt (<=80 chars): type ConsumerConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConsumerConfig
- HandlerConfig
- handler
- message
- transposeStreamID
```

--------------------------------------------------------------------------------

---[FILE: ai_agent_auth.go]---
Location: harness-main/types/ai_agent_auth.go
Signals: N/A
Excerpt (<=80 chars):  type AIAgentAuth struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AIAgentAuth
- APIKey
```

--------------------------------------------------------------------------------

---[FILE: ai_task.go]---
Location: harness-main/types/ai_task.go
Signals: N/A
Excerpt (<=80 chars):  type AITask struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AITask
- AIUsageMetric
- AITaskFilter
```

--------------------------------------------------------------------------------

---[FILE: authz.go]---
Location: harness-main/types/authz.go
Signals: N/A
Excerpt (<=80 chars): type PermissionCheck struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PermissionCheck
- Resource
- Scope
```

--------------------------------------------------------------------------------

---[FILE: branch.go]---
Location: harness-main/types/branch.go
Signals: N/A
Excerpt (<=80 chars):  type Branch struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Branch
- BranchTable
- BranchExtended
- CreateBranchOutput
- DeleteBranchOutput
- CommitDivergence
```

--------------------------------------------------------------------------------

---[FILE: cde_gateway.go]---
Location: harness-main/types/cde_gateway.go
Signals: N/A
Excerpt (<=80 chars):  type CDEGatewayStats struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CDEGatewayStats
- CDEGateway
- CDEGatewayFilter
```

--------------------------------------------------------------------------------

---[FILE: check.go]---
Location: harness-main/types/check.go
Signals: N/A
Excerpt (<=80 chars):  type Check struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Check
- CheckResult
- CheckPayload
- CheckListOptions
- CheckRecentOptions
- CheckPayloadText
- CheckPayloadInternal
- PullReqChecks
- PullReqCheck
- CheckCountSummary
- MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: codeowners.go]---
Location: harness-main/types/codeowners.go
Signals: N/A
Excerpt (<=80 chars):  type CodeOwnerEvaluation struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeOwnerEvaluation
- CodeOwnerEvaluationEntry
- UserGroupOwnerEvaluation
- OwnerEvaluation
- CodeOwnersValidation
- CodeOwnersViolation
- Add
- Addf
```

--------------------------------------------------------------------------------

---[FILE: code_comment.go]---
Location: harness-main/types/code_comment.go
Signals: N/A
Excerpt (<=80 chars):  type CodeComment struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeComment
- CodeCommentFields
```

--------------------------------------------------------------------------------

---[FILE: commit.go]---
Location: harness-main/types/commit.go
Signals: N/A
Excerpt (<=80 chars): type CommitFilesResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommitFilesResponse
- FileReference
- PathDetails
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/types/common.go
Signals: N/A
Excerpt (<=80 chars):  type TagPartType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SanitizeTag
```

--------------------------------------------------------------------------------

---[FILE: config.go]---
Location: harness-main/types/config.go
Signals: N/A
Excerpt (<=80 chars): type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: connector.go]---
Location: harness-main/types/connector.go
Signals: N/A
Excerpt (<=80 chars):  type Connector struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Connector
```

--------------------------------------------------------------------------------

---[FILE: connector_auth.go]---
Location: harness-main/types/connector_auth.go
Signals: N/A
Excerpt (<=80 chars): type ConnectorAuth struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectorAuth
- BasicAuthCreds
- BearerTokenCreds
- Validate
```

--------------------------------------------------------------------------------

---[FILE: connector_config.go]---
Location: harness-main/types/connector_config.go
Signals: N/A
Excerpt (<=80 chars): type ConnectorConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectorConfig
- Validate
```

--------------------------------------------------------------------------------

---[FILE: connector_test_response.go]---
Location: harness-main/types/connector_test_response.go
Signals: N/A
Excerpt (<=80 chars):  type ConnectorTestResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectorTestResponse
```

--------------------------------------------------------------------------------

````
