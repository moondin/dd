---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 22
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 22 of 37)

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

---[FILE: compat.go]---
Location: harness-main/registry/app/pkg/docker/compat.go
Signals: N/A
Excerpt (<=80 chars): type SplitReferences struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplitReferences
- References
- LikelyBuildxCache
- ContainsBlobs
- OCIManifestFromBuildkitIndex
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/registry/app/pkg/docker/context.go
Signals: N/A
Excerpt (<=80 chars): type Context struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Context
- BlobUploadState
- Value
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/pkg/docker/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DBStore
- TagsAPIResponse
- NewController
- NewDBStore
- ProxyWrapper
- HeadManifest
- PullManifest
- PutManifest
- DeleteManifest
- HeadBlob
- GetBlob
- InitiateUploadBlob
- GetUploadBlobStatus
- PatchBlobUpload
- CompleteBlobUpload
- CancelBlobUpload
- DeleteBlob
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/docker/local.go
Signals: N/A
Excerpt (<=80 chars):  type storageType int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CatalogAPIResponse
- LocalRegistry
- NewLocalRegistry
- Base
- CanBeMount
- GetArtifactType
- GetPackageTypes
- getManifest
- DBManifestToManifest
- getTag
- etagMatch
- copyFullPayload
- HeadBlob
- GetBlob
- fetchBlobInternal
- headBlobInternal
- PullManifest
- getDigestByTag
```

--------------------------------------------------------------------------------

---[FILE: manifest_service.go]---
Location: harness-main/registry/app/pkg/docker/manifest_service.go
Signals: N/A
Excerpt (<=80 chars):  type manifestService struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manifestService
- NewManifestService
- DBTag
- handleTagError
- dbTagManifest
- AddTagsToManifest
- addTagsWithTx
- reportEvents
- formatFailedToTagErr
- lockManifestForGC
- upsertTag
- getSpacePathAndPackageType
- reportEventAsync
- DBPut
- dbPutManifest
- upsertImageAndArtifact
- UpsertImage
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/docker/registry.go
Signals: N/A
Excerpt (<=80 chars): type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote.go]---
Location: harness-main/registry/app/pkg/docker/remote.go
Signals: N/A
Excerpt (<=80 chars):  func NewRemoteRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistry
- NewRemoteRegistry
- GetArtifactType
- GetPackageTypes
- Base
- proxyManifestHead
- ManifestExist
- PullManifest
- HeadBlob
- GetBlob
- fetchBlobInternal
- proxyManifestGet
- setHeaders
- canProxy
- PushBlobMonolith
- InitBlobUpload
- PushBlobMonolithWithDigest
- PushBlobChunk
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/pkg/docker/response.go
Signals: N/A
Excerpt (<=80 chars):  type Response interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Response
- GetManifestResponse
- PutManifestResponse
- DeleteManifestResponse
- GetBlobResponse
- GetErrors
- SetError
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/docker/wire.go
Signals: N/A
Excerpt (<=80 chars):  func LocalRegistryProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- noOpBucketService
- LocalRegistryProvider
- ManifestServiceProvider
- RemoteRegistryProvider
- ControllerProvider
- DBStoreProvider
- StorageServiceProvider
- ProvideReporter
- ProvideProxyController
- getManifestCacheHandler
- ProvideOciBlobStore
- ProvideBucketService
- GetBlobStore
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/registry/app/pkg/filemanager/context.go
Signals: N/A
Excerpt (<=80 chars): type Context struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Context
- Value
```

--------------------------------------------------------------------------------

---[FILE: file_manager.go]---
Location: harness-main/registry/app/pkg/filemanager/file_manager.go
Signals: N/A
Excerpt (<=80 chars):  func NewFileManager(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileManager
- NewFileManager
- UploadFile
- GetBlobsContext
- dbSaveFile
- SaveNodes
- SaveNodesTx
- CreateNodesWithoutFileNode
- moveFile
- createNodes
- SaveNode
- CopyNodes
- DownloadFile
- DeleteNode
- DeleteLeafNode
- GetNode
- HeadFile
- HeadSHA256
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/filemanager/wire.go
Signals: N/A
Excerpt (<=80 chars):  func Provider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Provider
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/generic/local.go
Signals: N/A
Excerpt (<=80 chars):  type localRegistry struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRegistry
- NewLocalRegistry
- GetArtifactType
- GetPackageTypes
- PutFile
- DownloadFile
- DeleteFile
- HeadFile
```

--------------------------------------------------------------------------------

---[FILE: local_helper.go]---
Location: harness-main/registry/app/pkg/generic/local_helper.go
Signals: N/A
Excerpt (<=80 chars):  type LocalRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelper
- NewLocalRegistryHelper
- FileExists
- DownloadFile
- PutFile
- DeleteFile
```

--------------------------------------------------------------------------------

---[FILE: proxy.go]---
Location: harness-main/registry/app/pkg/generic/proxy.go
Signals: N/A
Excerpt (<=80 chars):  type proxy struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proxy
- NewProxy
- GetArtifactType
- GetPackageTypes
- PutFile
- DownloadFile
- putFileToLocal
- DeleteFile
- HeadFile
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/generic/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote_helper.go]---
Location: harness-main/registry/app/pkg/generic/remote_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RemoteRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistryHelper
- NewRemoteRegistryHelper
- init
- GetFile
- HeadFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/generic/wire.go
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

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/gopackage/local.go
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
- metadataToReadCloser
- uploadFile
- publishArtifactCreatedEvent
- regeneratePackageIndex
- regeneratePackageMetadata
- DownloadPackageFile
- DownloadPackageIndex
- DownloadPackageLatestVersionInfo
- downloadFileInternal
```

--------------------------------------------------------------------------------

---[FILE: local_helper.go]---
Location: harness-main/registry/app/pkg/gopackage/local_helper.go
Signals: N/A
Excerpt (<=80 chars):  type LocalRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelper
- NewLocalRegistryHelper
- FileExists
- RegeneratePackageIndex
- RegeneratePackageMetadata
- DownloadFile
```

--------------------------------------------------------------------------------

---[FILE: proxy.go]---
Location: harness-main/registry/app/pkg/gopackage/proxy.go
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
- DownloadPackageFile
- DownloadPackageIndex
- DownloadPackageLatestVersionInfo
- downloadFileFromUpstream
- putFileToLocal
- cacheFileAndCreateOrUpdateVersion
- RegeneratePackageIndex
- RegeneratePackageMetadata
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/gopackage/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote_helper.go]---
Location: harness-main/registry/app/pkg/gopackage/remote_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RemoteRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistryHelper
- NewRemoteRegistryHelper
- init
- GetPackageFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/gopackage/wire.go
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

---[FILE: utils.go]---
Location: harness-main/registry/app/pkg/gopackage/utils/utils.go
Signals: N/A
Excerpt (<=80 chars): func GetModuleNameFromModFile(modBytes io.Reader) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetModuleNameFromModFile
- getImageAndFileNameFromURL
- getVersionFromFileName
- GetArtifactInfoFromURL
- GetIndexFilePath
- GetPackageMetadataFromInfoFile
- UpdateMetadataFromModFile
- UpdateMetadataFromZipFile
- parseReadme
- IsMainArtifactFile
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/huggingface/local.go
Signals: N/A
Excerpt (<=80 chars):  type localRegistry struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRegistry
- ValidateYaml
- PreUpload
- RevisionInfo
- LfsInfo
- LfsUpload
- LfsVerify
- CommitRevision
- HeadFile
- DownloadFile
- FileExists
- getBlobURL
- readme
- lfsAction
- validateSlice
- getTmpFilePath
- validateString
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/huggingface/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/huggingface/wire.go
Signals: N/A
Excerpt (<=80 chars): func LocalRegistryProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryProvider
```

--------------------------------------------------------------------------------

---[FILE: artifact.go]---
Location: harness-main/registry/app/pkg/maven/artifact.go
Signals: N/A
Excerpt (<=80 chars):  type Artifact interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Artifact
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/pkg/maven/controller.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactType int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DBStore
- NewController
- NewDBStore
- factory
- GetArtifactRegistry
- GetArtifact
- HeadArtifact
- PutArtifact
- ProxyWrapper
- GetOrderedRepos
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/maven/local.go
Signals: N/A
Excerpt (<=80 chars):  func NewLocalRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistry
- NewLocalRegistry
- GetMavenArtifactType
- HeadArtifact
- GetArtifact
- FetchArtifact
- PutArtifact
- updateArtifactMetadata
- processError
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/maven/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote.go]---
Location: harness-main/registry/app/pkg/maven/remote.go
Signals: N/A
Excerpt (<=80 chars):  func NewRemoteRegistry(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistry
- NewRemoteRegistry
- GetMavenArtifactType
- HeadArtifact
- GetArtifact
- PutArtifact
- fetchArtifact
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/pkg/maven/response.go
Signals: N/A
Excerpt (<=80 chars):  type Response interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Response
- HeadArtifactResponse
- GetArtifactResponse
- PutArtifactResponse
- GetErrors
- SetError
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/maven/wire.go
Signals: N/A
Excerpt (<=80 chars):  func LocalRegistryProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryProvider
- RemoteRegistryProvider
- ControllerProvider
- DBStoreProvider
- ProvideProxyController
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/pkg/maven/utils/utils.go
Signals: N/A
Excerpt (<=80 chars):  func GetFilePath(info pkg.MavenArtifactInfo) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetFilePath
- IsMainArtifactFile
- IsMetadataFile
- SetHeaders
- IsSnapshotVersion
- AddLikeBeforeExtension
- ParseResponseHeaders
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/npm/local.go
Signals: N/A
Excerpt (<=80 chars):  type localRegistry struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRegistry
- HeadPackageMetadata
- DownloadPackageFile
- NewLocalRegistry
- GetArtifactType
- GetPackageTypes
- UploadPackageFile
- GetPackageMetadata
- SearchPackage
- mapToPackageSearch
- getValueOrDefault
- getScope
- CreatePackageMetadataVersion
- ListTags
- AddTag
- DeleteTag
- DeletePackage
```

--------------------------------------------------------------------------------

---[FILE: local_helper.go]---
Location: harness-main/registry/app/pkg/npm/local_helper.go
Signals: N/A
Excerpt (<=80 chars):  type LocalRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelper
- NewLocalRegistryHelper
- FileExists
- DownloadFile
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: local_test.go]---
Location: harness-main/registry/app/pkg/npm/local_test.go
Signals: N/A
Excerpt (<=80 chars):  type mockLocalBase struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockLocalBase
- mockTagsDAO
- mockImageDAO
- mockArtifactDAO
- mockURLProvider
- TestParseAndUploadNPMPackage_WithAttachment_UploadsData
- UploadFile
- Upload
- MoveTempFileAndCreateArtifact
- Download
- Exists
- ExistsE
- DeleteFile
- ExistsByFilePath
- CheckIfVersionExists
- DeletePackage
- DeleteVersion
- MoveMultipleTempFilesAndCreateArtifact
```

--------------------------------------------------------------------------------

---[FILE: proxy.go]---
Location: harness-main/registry/app/pkg/npm/proxy.go
Signals: N/A
Excerpt (<=80 chars):  type proxy struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proxy
- SearchPackage
- UploadPackageFileReader
- HeadPackageMetadata
- ListTags
- AddTag
- DeleteTag
- DeletePackage
- DeleteVersion
- GetPackageMetadata
- NewProxy
- GetArtifactType
- GetPackageTypes
- DownloadPackageFile
- UploadPackageFile
- putFileToLocal
- UploadPackageFileWithoutParsing
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/npm/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote_helper.go]---
Location: harness-main/registry/app/pkg/npm/remote_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RemoteRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistryHelper
- NewRemoteRegistryHelper
- init
- GetPackage
- GetPackageMetadata
- GetVersionMetadata
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/npm/wire.go
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

---[FILE: helper.go]---
Location: harness-main/registry/app/pkg/nuget/helper.go
Signals: N/A
Excerpt (<=80 chars):  func buildServiceEndpoint(baseURL string) *nuget.ServiceEndpoint {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildServiceEndpoint
- buildServiceV2Endpoint
- getRegistrationIndexURL
- getRegistrationLeafURL
- getPackageDownloadURL
- getPackageMetadataURL
- getProxyURL
- getInnerXMLField
- validateAndNormaliseVersion
- createRegistrationIndexResponse
- createSearchV2Response
- createSearchResponse
- createSearchResultItem
- modifyContent
- replaceBaseWithURL
- getServiceMetadataV2
- createFeedResponse
- createFeedEntryResponse
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/nuget/local.go
Signals: N/A
Excerpt (<=80 chars):  type FileBundleType int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRegistry
- GetServiceEndpoint
- GetServiceEndpointV2
- GetServiceMetadataV2
- ListPackageVersion
- ListPackageVersionV2
- CountPackageVersionV2
- CountPackageV2
- SearchPackageV2
- SearchPackage
- GetPackageMetadata
- GetPackageVersionMetadataV2
- GetPackageVersionMetadata
- UploadPackage
- buildMetadata
- parseMetadata
- parseReadme
```

--------------------------------------------------------------------------------

---[FILE: local_helper.go]---
Location: harness-main/registry/app/pkg/nuget/local_helper.go
Signals: N/A
Excerpt (<=80 chars):  type LocalRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelper
- NewLocalRegistryHelper
- FileExists
- DownloadFile
- DeletePackage
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: proxy.go]---
Location: harness-main/registry/app/pkg/nuget/proxy.go
Signals: N/A
Excerpt (<=80 chars):  type proxy struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proxy
- UploadPackage
- DownloadPackage
- DeletePackage
- CountPackageVersionV2
- CountPackageV2
- SearchPackageV2
- SearchPackage
- ListPackageVersion
- GetPackageMetadata
- ListPackageVersionV2
- GetPackageVersionMetadataV2
- parseRegistrationIndexResponse
- parseRegistrationIndexPageResponse
- updateRegistrationIndexPageResponse
- updateRegistrationIndexResponse
- GetPackageVersionMetadata
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/nuget/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote_helper.go]---
Location: harness-main/registry/app/pkg/nuget/remote_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RemoteRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistryHelper
- NewRemoteRegistryHelper
- init
- GetFile
- GetPackageMetadata
- ListPackageVersion
- ListPackageVersionV2
- GetPackageVersionMetadataV2
- SearchPackageV2
- SearchPackage
- CountPackageV2
- CountPackageVersionV2
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/nuget/wire.go
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

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/python/local.go
Signals: N/A
Excerpt (<=80 chars):  type localRegistry struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRegistry
- NewLocalRegistry
- GetArtifactType
- GetPackageTypes
- DownloadPackageFile
- GetPackageMetadata
- sortPackageMetadata
- parseVersion
- UploadPackageFile
- UploadPackageFileReader
```

--------------------------------------------------------------------------------

---[FILE: local_helper.go]---
Location: harness-main/registry/app/pkg/python/local_helper.go
Signals: N/A
Excerpt (<=80 chars):  type LocalRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelper
- NewLocalRegistryHelper
- FileExists
- DownloadFile
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: local_helper_test.go]---
Location: harness-main/registry/app/pkg/python/local_helper_test.go
Signals: N/A
Excerpt (<=80 chars):  type MockLocalRegistry struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockLocalRegistry
- MockLocalBase
- MockReadCloser
- GetArtifactType
- GetPackageTypes
- DownloadPackageFile
- GetPackageMetadata
- UploadPackageFile
- UploadPackageFileReader
- ExistsE
- DeleteFile
- MoveTempFileAndCreateArtifact
- CheckIfVersionExists
- DeletePackage
- DeleteVersion
- Exists
- ExistsByFilePath
- Download
```

--------------------------------------------------------------------------------

---[FILE: proxy.go]---
Location: harness-main/registry/app/pkg/python/proxy.go
Signals: N/A
Excerpt (<=80 chars):  type proxy struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proxy
- NewProxy
- GetArtifactType
- GetPackageTypes
- DownloadPackageFile
- GetPackageMetadata
- putFileToLocal
- UploadPackageFile
- UploadPackageFileReader
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/python/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
```

--------------------------------------------------------------------------------

---[FILE: remote_helper.go]---
Location: harness-main/registry/app/pkg/python/remote_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RemoteRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistryHelper
- NewRemoteRegistryHelper
- init
- GetFile
- GetMetadata
- GetJSON
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/python/wire.go
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

---[FILE: finder.go]---
Location: harness-main/registry/app/pkg/quarantine/finder.go
Signals: N/A
Excerpt (<=80 chars): type CacheKey struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CacheKey
- Finder
- quarantineCacheGetter
- NewFinder
- CheckArtifactQuarantineStatus
- CheckOCIManifestQuarantineStatus
- EvictCache
- Find
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/registry/app/pkg/quarantine/service.go
Signals: N/A
Excerpt (<=80 chars): type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- CheckArtifactQuarantineStatus
- ResolveDigest
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/quarantine/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideEvictorQuarantine(pubsub pubsub.PubSub) cache2.Evictor[*CacheKey] {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideEvictorQuarantine
- ProvideService
- ProvideQuarantineCache
- ProvideFinder
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/pkg/response/response.go
Signals: N/A
Excerpt (<=80 chars):  type Response interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Response
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/registry/app/pkg/rpm/helper.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryHelper
- NewRegistryHelper
- UploadPackage
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/pkg/rpm/local.go
Signals: N/A
Excerpt (<=80 chars):  type localRegistry struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localRegistry
- NewLocalRegistry
- GetArtifactType
- GetPackageTypes
- UploadPackageFile
- GetRepoData
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: proxy.go]---
Location: harness-main/registry/app/pkg/rpm/proxy.go
Signals: N/A
Excerpt (<=80 chars):  type proxy struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proxy
- NewProxy
- GetArtifactType
- GetPackageTypes
- DownloadPackageFile
- GetRepoData
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/pkg/rpm/registry.go
Signals: N/A
Excerpt (<=80 chars):  type Registry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Registry
- downloadPackageFile
- getRepoData
```

--------------------------------------------------------------------------------

---[FILE: remote_helper.go]---
Location: harness-main/registry/app/pkg/rpm/remote_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RemoteRegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteRegistryHelper
- NewRemoteRegistryHelper
- init
- GetMetadataFile
- GetPackage
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/pkg/rpm/wire.go
Signals: N/A
Excerpt (<=80 chars):  func LocalRegistryProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryProvider
- RegistryHelperProvider
- ProxyProvider
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/cargo/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- SearchPackageRequestParams
- SearchPackageRequestInfo
- GetVersion
- BaseArtifactInfo
- GetImageVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/commons/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- BaseArtifactInfo
- GetImageVersion
- GetVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/generic/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- File
- PackageMetadata
- BaseArtifactInfo
- GetImageVersion
- GetVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/gopackage/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- GetVersion
- BaseArtifactInfo
- GetImageVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/huggingface/types.go
Signals: N/A
Excerpt (<=80 chars): type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- File
- PackageMetadata
- Debug
- ValidateYamlRequest
- ValidateYamlResponse
- PreUploadResponse
- PreUploadRequest
- PreUploadResponseFile
- PreUploadRequestFile
- RevisionInfoResponse
- LfsInfoRequest
- LfsObjectRequest
- LfsRefRequest
- LfsInfoResponse
- LfsVerifyResponse
- LfsUploadResponse
- CommitRevisionResponse
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/npm/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- File
- PackageMetadata
- BaseArtifactInfo
- GetImageVersion
- GetVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/nuget/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- File
- PackageMetadata
- ServiceEndpoint
- Resource
- AtomTitle
- ServiceCollection
- ServiceWorkspace
- ServiceMetadataV2
- ServiceEndpointV2
- EdmxPropertyRef
- EdmxProperty
- EdmxEntityType
- EdmxFunctionParameter
- EdmxFunctionImport
- EdmxEntitySet
- EdmxEntityContainer
- EdmxSchema
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/python/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- File
- PackageMetadata
- BaseArtifactInfo
- GetImageVersion
- GetVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/pkg/types/rpm/types.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactInfo struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactInfo
- File
- PackageMetadata
- GetVersion
- BaseArtifactInfo
- GetImageVersion
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/adapter.go
Signals: N/A
Excerpt (<=80 chars): type Factory interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Factory
- Adapter
- ArtifactRegistry
- RegisterFactory
- GetFactory
- ListRegisteredAdapterTypes
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/awsecr/adapter.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- factory
- adapter
- init
- newAdapter
- Create
- HealthCheck
- GetImageName
```

--------------------------------------------------------------------------------

---[FILE: auth.go]---
Location: harness-main/registry/app/remote/adapter/awsecr/auth.go
Signals: N/A
Excerpt (<=80 chars): type Credential modifier.Modifier

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- awsAuthCredential
- cacheToken
- TokenResponse
- Modify
- getAwsSvc
- parseAccountRegion
- getCreds
- getSecretValue
- getAuthorization
- isTokenValid
- NewAuth
- getPublicECRToken
- buildTokenURL
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/remote/adapter/commons/utils.go
Signals: N/A
Excerpt (<=80 chars):  func GetCredentials(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetCredentials
- getSecretValue
```

--------------------------------------------------------------------------------

---[FILE: dto.go]---
Location: harness-main/registry/app/remote/adapter/commons/pypi/dto.go
Signals: N/A
Excerpt (<=80 chars):  type SimpleMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SimpleMetadata
- Package
- URL
- Valid
- RequiresPython
- Version
- String
- GetPyPIVersion
- stripRecognizedExtension
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/crates/adapter.go
Signals: N/A
Excerpt (<=80 chars):  type adapter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter
- factory
- newAdapter
- Create
- init
- GetRegistryConfig
- GetPackageFile
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/dockerhub/adapter.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- factory
- adapter
- init
- newAdapter
- Create
- GetImageName
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/registry/app/remote/adapter/dockerhub/client.go
Signals: N/A
Excerpt (<=80 chars): type Client struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Client
- NewClient
- Do
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/remote/adapter/dockerhub/types.go
Signals: N/A
Excerpt (<=80 chars): type LoginCredential struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoginCredential
- TokenResp
- NamespacesResp
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/generic/adapter.go
Signals: N/A
Excerpt (<=80 chars):  type adapter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter
- factory
- newAdapter
- Create
- init
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/registry/app/remote/adapter/generic/client.go
Signals: N/A
Excerpt (<=80 chars):  type client struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- client
- newClient
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/goproxy/adapter.go
Signals: N/A
Excerpt (<=80 chars):  type adapter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter
- factory
- newAdapter
- Create
- init
- GetPackageFile
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/maven/adapter.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- factory
- adapter
- Client
- init
- newAdapter
- Create
- NewClient
- GetImageName
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/native/adapter.go
Signals: N/A
Excerpt (<=80 chars): type Adapter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Adapter
- NewAdapter
- NewAdapterWithAuthorizer
- HealthCheck
- PingSimple
- DeleteTag
- CanBeMount
- GetImageName
```

--------------------------------------------------------------------------------

---[FILE: adaptor.go]---
Location: harness-main/registry/app/remote/adapter/npmjs/adaptor.go
Signals: N/A
Excerpt (<=80 chars):  type adapter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter
- factory
- newAdapter
- Create
- init
- GetPackageMetadata
- GetPackage
- ParseNPMMetadata
```

--------------------------------------------------------------------------------

````
