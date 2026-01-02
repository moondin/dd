---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 21
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 21 of 37)

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

---[FILE: factory.go]---
Location: harness-main/registry/app/driver/factory/factory.go
Signals: N/A
Excerpt (<=80 chars): type StorageDriverFactory interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StorageDriverFactory
- InvalidStorageDriverError
- Register
- Create
- Error
```

--------------------------------------------------------------------------------

---[FILE: driver.go]---
Location: harness-main/registry/app/driver/filesystem/driver.go
Signals: N/A
Excerpt (<=80 chars):  func GetDriverName() string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DriverParameters
- filesystemDriverFactory
- driver
- baseEmbed
- fileInfo
- fileWriter
- GetDriverName
- Register
- init
- Create
- CopyObject
- BatchCopyObjects
- FromParameters
- fromParametersImpl
- New
- Name
- GetContent
```

--------------------------------------------------------------------------------

---[FILE: gcs.go]---
Location: harness-main/registry/app/driver/gcs/gcs.go
Signals: N/A
Excerpt (<=80 chars): type driverParameters struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- driverParameters
- gcsDriverFactory
- driver
- Wrapper
- baseEmbed
- writer
- init
- Create
- FromParameters
- New
- Name
- GetContent
- PutContent
- Reader
- Cancel
- Close
```

--------------------------------------------------------------------------------

---[FILE: gcs_test.go]---
Location: harness-main/registry/app/driver/gcs/gcs_test.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- newDriverConstructor
- TestGCSDriverSuite
- BenchmarkGCSDriverSuite
- TestCommitEmpty
- TestCommit
- TestRetry
- TestEmptyRootList
- TestMoveDirectory
```

--------------------------------------------------------------------------------

---[FILE: s3.go]---
Location: harness-main/registry/app/driver/s3-aws/s3.go
Signals: N/A
Excerpt (<=80 chars): type DriverParameters struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DriverParameters
- s3DriverFactory
- driver
- baseEmbed
- buffer
- writer
- GetDriverName
- init
- Register
- Create
- CopyObject
- performMultipartCopy
- BatchCopyObjects
- FromParameters
- getS3LogLevelFromParam
- getParameterAsInt64
- New
```

--------------------------------------------------------------------------------

---[FILE: s3_v2_signer.go]---
Location: harness-main/registry/app/driver/s3-aws/s3_v2_signer.go
Signals: N/A
Excerpt (<=80 chars):  type signer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- signer
- setv2Handlers
- Sign
```

--------------------------------------------------------------------------------

---[FILE: testsuites.go]---
Location: harness-main/registry/app/driver/testsuites/testsuites.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DriverSuite
- DriverBenchmarkSuite
- randReader
- init
- Driver
- SetupSuite
- TearDownSuite
- TearDownTest
- TestRootExists
- TestValidPaths
- deletePath
- TestInvalidPaths
- TestWriteRead1
- TestWriteRead2
- TestWriteRead3
- TestWriteRead4
- TestWriteReadNonUTF8
- TestTruncate
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/registry/app/event/reporter.go
Signals: N/A
Excerpt (<=80 chars):  type PackageType int32

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactDetails
- Reporter
- Noop
- GetPackageTypeFromString
- ReportEvent
```

--------------------------------------------------------------------------------

---[FILE: artifacts.go]---
Location: harness-main/registry/app/events/artifact/artifacts.go
Signals: N/A
Excerpt (<=80 chars): type ArtifactCreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactCreatedPayload
- Artifact
- BaseArtifact
- DockerArtifact
- HelmArtifact
- CommonArtifact
- ArtifactInfo
- ArtifactDeletedPayload
- GetInfo
- ArtifactCreated
- RegisterArtifactCreated
- ArtifactDeleted
- RegisterArtifactDeleted
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/registry/app/events/artifact/reader.go
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
Location: harness-main/registry/app/events/artifact/reporter.go
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
Location: harness-main/registry/app/events/artifact/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideArtifactReporter
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/registry/app/events/asyncprocessing/events.go
Signals: N/A
Excerpt (<=80 chars):  type ExecuteAsyncTaskPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecuteAsyncTaskPayload
- BuildRegistryIndex
- BuildRegistryIndexWithPrincipal
- BuildPackageIndex
- BuildPackageIndexWithPrincipal
- BuildPackageMetadata
- BuildPackageMetadataWithPrincipal
- upsertAndSendEvent
- upsertTask
- RegisterExecuteAsyncTask
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/registry/app/events/asyncprocessing/reader.go
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
Location: harness-main/registry/app/events/asyncprocessing/reporter.go
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
Location: harness-main/registry/app/events/asyncprocessing/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideAsyncProcessingReporter
```

--------------------------------------------------------------------------------

---[FILE: replication.go]---
Location: harness-main/registry/app/events/replication/replication.go
Signals: N/A
Excerpt (<=80 chars):  type BlobAction string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CloudLocation
- ReplicationDetails
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/registry/app/events/replication/reporter.go
Signals: N/A
Excerpt (<=80 chars):  type Reporter interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- Noop
- NewReporter
- ReportEventAsync
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/events/replication/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReplicationReporter(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReplicationReporter
- ProvideNoOpReplicationReporter
```

--------------------------------------------------------------------------------

---[FILE: package.go]---
Location: harness-main/registry/app/factory/package.go
Signals: N/A
Excerpt (<=80 chars):  type PackageFactory interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageFactory
- NewPackageFactory
- Register
- Get
- GetAllPackageTypes
- IsValidPackageType
```

--------------------------------------------------------------------------------

---[FILE: package_wrapper.go]---
Location: harness-main/registry/app/helpers/package_wrapper.go
Signals: N/A
Excerpt (<=80 chars):  type packageWrapper struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- packageWrapper
- NewPackageWrapper
- GetPackage
- IsValidPackageType
- IsValidPackageTypes
- IsValidRepoType
- IsValidRepoTypes
- ValidateRepoType
- IsValidUpstreamSource
- IsValidUpstreamSources
- ValidateUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPackageTypeFromPathPackageType
- DeleteArtifactVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- DeleteArtifact
```

--------------------------------------------------------------------------------

---[FILE: registry_helper.go]---
Location: harness-main/registry/app/helpers/registry_helper.go
Signals: N/A
Excerpt (<=80 chars):  type registryHelper struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registryHelper
- NewRegistryHelper
- GetAuthHeaderPrefix
- DeleteFileNode
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- DeleteGenericImage
- GetPackageURL
- GetHostName
- GetArtifactMetadata
- GetArtifactVersionMetadata
- GetFileMetadata
- GetArtifactDetail
- GetTimeInMs
- GetImageSize
- GetSize
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/helpers/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvidePackageWrapperProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvidePackageWrapperProvider
- ProvideRegistryHelper
```

--------------------------------------------------------------------------------

---[FILE: cargo.go]---
Location: harness-main/registry/app/helpers/pkg/cargo.go
Signals: N/A
Excerpt (<=80 chars):  type CargoPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CargoPackageType
- UpstreamSourceConfig
- NewCargoPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- GetDownloadFileCommand
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
```

--------------------------------------------------------------------------------

---[FILE: docker.go]---
Location: harness-main/registry/app/helpers/pkg/docker.go
Signals: N/A
Excerpt (<=80 chars):  type DockerPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerPackageType
- NewDockerPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: generic.go]---
Location: harness-main/registry/app/helpers/pkg/generic.go
Signals: N/A
Excerpt (<=80 chars):  type GenericPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericPackageType
- NewGenericPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: gopkg.go]---
Location: harness-main/registry/app/helpers/pkg/gopkg.go
Signals: N/A
Excerpt (<=80 chars):  type GoPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoPackageType
- NewGoPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: helm.go]---
Location: harness-main/registry/app/helpers/pkg/helm.go
Signals: N/A
Excerpt (<=80 chars):  type HelmPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HelmPackageType
- NewHelmPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: huggingface.go]---
Location: harness-main/registry/app/helpers/pkg/huggingface.go
Signals: N/A
Excerpt (<=80 chars):  type HuggingFacePackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HuggingFacePackageType
- NewHuggingFacePackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: maven.go]---
Location: harness-main/registry/app/helpers/pkg/maven.go
Signals: N/A
Excerpt (<=80 chars):  type MavenPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MavenPackageType
- NewMavenPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: node_path_test.go]---
Location: harness-main/registry/app/helpers/pkg/node_path_test.go
Signals: Gin
Excerpt (<=80 chars):  func TestCargoPackageType_GetNodePathsForImage_Updated(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCargoPackageType_GetNodePathsForImage_Updated
- TestCargoPackageType_GetNodePathsForArtifact_Updated
- TestDockerPackageType_GetNodePathsForImage_Updated
- TestDockerPackageType_GetNodePathsForArtifact_Updated
- TestMavenPackageType_GetNodePathsForImage_Updated
- TestMavenPackageType_GetNodePathsForArtifact_Updated
- TestGoPackageType_GetNodePathsForImage_Updated
- TestGoPackageType_GetNodePathsForArtifact_Updated
- TestRpmPackageType_GetNodePathsForImage_Updated
- TestRpmPackageType_GetNodePathsForArtifact_Updated
- TestNpmPackageType_GetNodePathsForImage_Updated
- TestNpmPackageType_GetNodePathsForArtifact_Updated
- TestHelmPackageType_GetNodePathsForImage_Updated
- TestHelmPackageType_GetNodePathsForArtifact_Updated
- TestGenericPackageType_GetNodePathsForImage_Updated
- TestGenericPackageType_GetNodePathsForArtifact_Updated
- TestNugetPackageType_GetNodePathsForImage_Updated
- TestNugetPackageType_GetNodePathsForArtifact_Updated
```

--------------------------------------------------------------------------------

---[FILE: npm.go]---
Location: harness-main/registry/app/helpers/pkg/npm.go
Signals: N/A
Excerpt (<=80 chars):  type NPMPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NPMPackageType
- NewNPMPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: nuget.go]---
Location: harness-main/registry/app/helpers/pkg/nuget.go
Signals: N/A
Excerpt (<=80 chars):  type NugetPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NugetPackageType
- NewNugetPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: python.go]---
Location: harness-main/registry/app/helpers/pkg/python.go
Signals: N/A
Excerpt (<=80 chars):  type PythonPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PythonPackageType
- NewPythonPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: rpm.go]---
Location: harness-main/registry/app/helpers/pkg/rpm.go
Signals: N/A
Excerpt (<=80 chars):  type RPMPackageType interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RPMPackageType
- NewRPMPackageType
- GetPackageType
- GetPathPackageType
- IsValidRepoType
- IsValidUpstreamSource
- IsURLRequiredForUpstreamSource
- GetPullCommand
- DeleteImage
- DeleteVersion
- ReportDeleteVersionEvent
- ReportBuildPackageIndexEvent
- ReportBuildRegistryIndexEvent
- GetFilePath
- DeleteArtifact
- GetPackageURL
- GetArtifactMetadata
```

--------------------------------------------------------------------------------

---[FILE: descriptor.go]---
Location: harness-main/registry/app/manifest/descriptor.go
Signals: N/A
Excerpt (<=80 chars): type Descriptor struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Descriptor
```

--------------------------------------------------------------------------------

---[FILE: errors.go]---
Location: harness-main/registry/app/manifest/errors.go
Signals: N/A
Excerpt (<=80 chars): type TagUnknownError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagUnknownError
- RegistryUnknownError
- RegistryNameInvalidError
- UnknownError
- UnknownRevisionError
- UnverifiedError
- ReferencesExceedLimitError
- PayloadSizeExceedsLimitError
- BlobUnknownError
- NameInvalidError
- Error
```

--------------------------------------------------------------------------------

---[FILE: manifests.go]---
Location: harness-main/registry/app/manifest/manifests.go
Signals: N/A
Excerpt (<=80 chars): type Manifest interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Manifest
- ManifestV2
- ManifestOCI
- ManifestBuilder
- ManifestEnumerator
- Describable
- ManifestMediaTypes
- UnmarshalManifest
- RegisterManifestSchema
```

--------------------------------------------------------------------------------

---[FILE: versioned.go]---
Location: harness-main/registry/app/manifest/versioned.go
Signals: N/A
Excerpt (<=80 chars): type Versioned struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Versioned
```

--------------------------------------------------------------------------------

---[FILE: manifestlist.go]---
Location: harness-main/registry/app/manifest/manifestlist/manifestlist.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PlatformSpec
- ManifestDescriptor
- ManifestList
- DeserializedManifestList
- init
- References
- FromDescriptors
- fromDescriptorsWithMediaType
- UnmarshalJSON
- MarshalJSON
- Payload
- validateManifestList
```

--------------------------------------------------------------------------------

---[FILE: manifestlist_test.go]---
Location: harness-main/registry/app/manifest/manifestlist/manifestlist_test.go
Signals: N/A
Excerpt (<=80 chars):  func makeTestManifestList(t *testing.T, mediaType string) ([]ManifestDescrip...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeTestManifestList
- TestManifestList
- mediaTypeTest
- TestMediaTypes
- TestValidateManifestList
```

--------------------------------------------------------------------------------

---[FILE: index.go]---
Location: harness-main/registry/app/manifest/ocischema/index.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImageIndex
- DeserializedImageIndex
- init
- References
- FromDescriptors
- fromDescriptorsWithMediaType
- UnmarshalJSON
- MarshalJSON
- Payload
- validateIndex
- ArtifactType
- Subject
- Annotations
```

--------------------------------------------------------------------------------

---[FILE: manifest.go]---
Location: harness-main/registry/app/manifest/ocischema/manifest.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Manifest
- DeserializedManifest
- init
- References
- Target
- FromStruct
- UnmarshalJSON
- MarshalJSON
- Payload
- validateManifest
- Version
- Config
- Layers
- DistributableLayers
- ArtifactType
- Subject
- Annotations
- TotalSize
```

--------------------------------------------------------------------------------

---[FILE: manifest.go]---
Location: harness-main/registry/app/manifest/schema2/manifest.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Manifest
- DeserializedManifest
- init
- References
- Target
- FromStruct
- UnmarshalJSON
- MarshalJSON
- Version
- Config
- Layers
- DistributableLayers
- TotalSize
- Payload
```

--------------------------------------------------------------------------------

---[FILE: manifest_test.go]---
Location: harness-main/registry/app/manifest/schema2/manifest_test.go
Signals: N/A
Excerpt (<=80 chars):  func makeTestManifest(mediaType string) Manifest {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeTestManifest
- TestManifest
- mediaTypeTest
- TestMediaTypes
```

--------------------------------------------------------------------------------

---[FILE: file.go]---
Location: harness-main/registry/app/metadata/file.go
Signals: N/A
Excerpt (<=80 chars):  type File struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- File
```

--------------------------------------------------------------------------------

---[FILE: pkg.go]---
Location: harness-main/registry/app/metadata/pkg.go
Signals: N/A
Excerpt (<=80 chars):  type GenericMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericMetadata
- MavenMetadata
```

--------------------------------------------------------------------------------

---[FILE: provider.go]---
Location: harness-main/registry/app/metadata/provider.go
Signals: N/A
Excerpt (<=80 chars):  type Metadata interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Metadata
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/cargo/metadata.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryConfig
- Dependency
- VersionDependency
- IndexDependency
- VersionMetadata
- IndexMetadata
- VersionMetadataDB
- GetFiles
- SetFiles
- GetSize
- UpdateSize
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/generic/metadata.go
Signals: N/A
Excerpt (<=80 chars): type GenericMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericMetadata
- GetFiles
- SetFiles
- GetSize
- UpdateSize
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/gopackage/metadata.go
Signals: N/A
Excerpt (<=80 chars): type VersionMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionMetadata
- Origin
- Dependency
- VersionMetadataDB
- GetFiles
- SetFiles
- GetSize
- UpdateSize
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/huggingface/metadata.go
Signals: N/A
Excerpt (<=80 chars): type CardData struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CardData
- Sibling
- Metadata
- HuggingFaceMetadata
- GetFiles
- SetFiles
- GetSize
- UpdateSize
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/npm/metadata.go
Signals: N/A
Excerpt (<=80 chars): type PackageAttachment struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageAttachment
- PackageUpload
- PackageMetadata
- PackageMetadataVersion
- Repository
- PackageDistribution
- PackageSearch
- PackageSearchObject
- PackageSearchPackage
- PackageSearchPackageLinks
- User
- NpmMetadata
- GetFiles
- SetFiles
- GetSize
- UpdateSize
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/nuget/metadata.go
Signals: N/A
Excerpt (<=80 chars): type NugetMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NugetMetadata
- Metadata
- PackageMetadata
- Dependency
- DependencyGroup
- PackageType
- Repository
- License
- DependenciesWrapper
- File
- FilesWrapper
- GetFiles
- SetFiles
- GetSize
- UpdateSize
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/python/metadata.go
Signals: N/A
Excerpt (<=80 chars): type Metadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Metadata
- PythonMetadata
- GetFiles
- SetFiles
- GetSize
- UpdateSize
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/metadata/rpm/metadata.go
Signals: N/A
Excerpt (<=80 chars):  type Metadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Metadata
- VersionMetadata
- FileMetadata
- Entry
- File
- Changelog
- RpmMetadata
- GetSize
- UpdateSize
- GetFiles
- SetFiles
```

--------------------------------------------------------------------------------

---[FILE: artifact.go]---
Location: harness-main/registry/app/pkg/artifact.go
Signals: N/A
Excerpt (<=80 chars): type Artifact interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Artifact
```

--------------------------------------------------------------------------------

---[FILE: artifact_info.go]---
Location: harness-main/registry/app/pkg/artifact_info.go
Signals: N/A
Excerpt (<=80 chars): type PackageArtifactInfo interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageArtifactInfo
- ArtifactInfoProvider
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/registry/app/pkg/context.go
Signals: N/A
Excerpt (<=80 chars):  type BaseInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseInfo
- ArtifactInfo
- RegistryInfo
- MavenArtifactInfo
- GenericArtifactInfo
- GetImage
- GetRegistryID
- UpdateRegistryInfo
- SetReference
- SetRepoKey
- SetMavenRepoKey
- BaseArtifactInfo
- GetImageVersion
- GetVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: core_controller.go]---
Location: harness-main/registry/app/pkg/core_controller.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactType int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CoreController
- NewCoreController
- factory
- GetArtifact
- GetOrderedRepos
```

--------------------------------------------------------------------------------

---[FILE: helpers.go]---
Location: harness-main/registry/app/pkg/helpers.go
Signals: N/A
Excerpt (<=80 chars): func GetRegistryCheckAccess(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRegistryCheckAccess
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/pkg/utils.go
Signals: N/A
Excerpt (<=80 chars):  func IsEmpty(slice any) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IsEmpty
- JoinWithSeparator
- ExtractFirstNumber
```

--------------------------------------------------------------------------------

---[FILE: utils_test.go]---
Location: harness-main/registry/app/pkg/utils_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestIsEmpty(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestIsEmpty
- TestJoinWithSeparator
- TestExtractFirstNumber
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/wire.go
Signals: N/A
Excerpt (<=80 chars):  func CoreControllerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CoreControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: base.go]---
Location: harness-main/registry/app/pkg/base/base.go
Signals: N/A
Excerpt (<=80 chars):  type LocalBase interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalBase
- NewLocalBase
- UploadFile
- Upload
- MoveTempFileAndCreateArtifact
- MoveMultipleTempFilesAndCreateArtifact
- updateFilesMetadata
- uploadInternal
- postUploadArtifact
- Download
- Exists
- ExistsE
- DeleteFile
- ExistsByFilePath
- CheckIfVersionExists
- getSHA256
- GetSHA256ByPath
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/pkg/base/utils.go
Signals: N/A
Excerpt (<=80 chars):  func GetCompletePath(info pkg.PackageArtifactInfo, filePath string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetCompletePath
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/base/wire.go
Signals: N/A
Excerpt (<=80 chars):  func LocalBaseProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalBaseProvider
```

--------------------------------------------------------------------------------

---[FILE: wrapper.go]---
Location: harness-main/registry/app/pkg/base/wrapper.go
Signals: N/A
Excerpt (<=80 chars):  func Register(registries ...pkg.Artifact) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Register
- NoProxyWrapper
- ProxyWrapper
- proxyInternal
- factory
- getFactoryKey
- GetArtifactRegistry
- filterRegs
- GetOrderedRepos
- SearchPackagesProxyWrapper
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/registry/app/pkg/cargo/helper.go
Signals: N/A
Excerpt (<=80 chars):  func getCrateFileName(imageName string, version string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cargoManifest
- getCrateFileName
- getCrateFilePath
- getPackageIndexFilePath
- downloadPackageFilePath
- getReadmePath
- generateMetadataFromFile
- extractCrate
- parseCargoToml
- mapCargoManifestToVersionMetadata
- parseDependencies
- parseDependency
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/cargo/local.go
Signals: N/A
Excerpt (<=80 chars):  type localRegistry struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRegistry
- NewLocalRegistry
- GetArtifactType
- GetPackageTypes
- UploadPackage
- uploadFile
- publishArtifactCreatedEvent
- regeneratePackageIndex
- DownloadPackageIndex
- DownloadPackage
- downloadFileInternal
- UpdateYank
- updateYankInternal
```

--------------------------------------------------------------------------------

---[FILE: local_helper.go]---
Location: harness-main/registry/app/pkg/cargo/local_helper.go
Signals: N/A
Excerpt (<=80 chars):  type LocalRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelper
- NewLocalRegistryHelper
- FileExists
- DownloadFile
- UpdatePackageIndex
- MoveTempFile
```

--------------------------------------------------------------------------------

---[FILE: proxy.go]---
Location: harness-main/registry/app/pkg/cargo/proxy.go
Signals: N/A
Excerpt (<=80 chars):  type proxy struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proxy
- NewProxy
- GetArtifactType
- GetPackageTypes
- UploadPackage
- DownloadPackageIndex
- DownloadPackage
- UpdateYank
- RegeneratePackageIndex
- putFileToLocal
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/cargo/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote_helper.go]---
Location: harness-main/registry/app/pkg/cargo/remote_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RemoteRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistryHelper
- NewRemoteRegistryHelper
- init
- GetRegistryConfig
- GetPackageIndex
- GetPackageFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/cargo/wire.go
Signals: N/A
Excerpt (<=80 chars):  func LocalRegistryProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryProvider
- ProxyProvider
- LocalRegistryHelperProvider
```

--------------------------------------------------------------------------------

---[FILE: request.go]---
Location: harness-main/registry/app/pkg/commons/request.go
Signals: N/A
Excerpt (<=80 chars):  type ResponseHeaders struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResponseHeaders
- IsEmpty
- IsEmptyError
- WriteToResponse
- WriteHeadersToResponse
- ServeContent
```

--------------------------------------------------------------------------------

---[FILE: usererror.go]---
Location: harness-main/registry/app/pkg/commons/usererror.go
Signals: N/A
Excerpt (<=80 chars): type Error struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Error
- New
- NotFoundError
```

--------------------------------------------------------------------------------

---[FILE: central_directory.go]---
Location: harness-main/registry/app/pkg/commons/zipreader/central_directory.go
Signals: N/A
Excerpt (<=80 chars): func discardCentralDirectory(br *bufio.Reader) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- discardCentralDirectory
- discardDirectoryHeaderRecord
- discardDirectoryEndRecord
```

--------------------------------------------------------------------------------

---[FILE: crc_reader.go]---
Location: harness-main/registry/app/pkg/commons/zipreader/crc_reader.go
Signals: N/A
Excerpt (<=80 chars):  type crcReader struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- crcReader
- Read
```

--------------------------------------------------------------------------------

---[FILE: descriptor.go]---
Location: harness-main/registry/app/pkg/commons/zipreader/descriptor.go
Signals: N/A
Excerpt (<=80 chars):  type descriptorReader struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- descriptorReader
- Read
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/registry/app/pkg/commons/zipreader/reader.go
Signals: N/A
Excerpt (<=80 chars): type Reader struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reader
- NewReader
- Next
- Buffered
```

--------------------------------------------------------------------------------

---[FILE: stolen.go]---
Location: harness-main/registry/app/pkg/commons/zipreader/stolen.go
Signals: N/A
Excerpt (<=80 chars): type Decompressor func(io.Reader) io.ReadCloser

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegisterDecompressor
- decompressor
- uint16
- uint32
```

--------------------------------------------------------------------------------

---[FILE: app.go]---
Location: harness-main/registry/app/pkg/docker/app.go
Signals: N/A
Excerpt (<=80 chars): type App struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- App
- NewApp
- StorageService
- GetStorageService
- LogError
- configureSecret
- GetBlobsContext
```

--------------------------------------------------------------------------------

---[FILE: bucket_service.go]---
Location: harness-main/registry/app/pkg/docker/bucket_service.go
Signals: N/A
Excerpt (<=80 chars): type BlobStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlobStore
- BucketService
```

--------------------------------------------------------------------------------

---[FILE: catalog.go]---
Location: harness-main/registry/app/pkg/docker/catalog.go
Signals: N/A
Excerpt (<=80 chars): func CreateLinkEntry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateLinkEntry
- generateLink
- EncodeFilter
```

--------------------------------------------------------------------------------

````
