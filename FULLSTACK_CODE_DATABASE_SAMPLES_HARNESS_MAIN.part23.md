---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 23
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 23 of 37)

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

---[FILE: client.go]---
Location: harness-main/registry/app/remote/adapter/npmjs/client.go
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
Location: harness-main/registry/app/remote/adapter/nuget/adapter.go
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
- GetServiceEndpoint
- GetPackageMetadata
- GetPackageVersionMetadataV2
- GetPackage
- ListPackageVersion
- ListPackageVersionV2
- SearchPackageV2
- SearchPackage
- CountPackageV2
- CountPackageVersionV2
- ParseServiceEndpointResponse
- getResourceByTypePrefix
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/registry/app/remote/adapter/nuget/client.go
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
Location: harness-main/registry/app/remote/adapter/pypi/adapter.go
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
- GetMetadata
- validateMetadata
- GetPackage
- GetJSON
- ParseMetadata
- ParsePyPISimple
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/registry/app/remote/adapter/pypi/client.go
Signals: N/A
Excerpt (<=80 chars):  type client struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- client
- newClient
```

--------------------------------------------------------------------------------

---[FILE: dto.go]---
Location: harness-main/registry/app/remote/adapter/pypi/dto.go
Signals: N/A
Excerpt (<=80 chars):  type Response struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Response
```

--------------------------------------------------------------------------------

---[FILE: adapter.go]---
Location: harness-main/registry/app/remote/adapter/rpm/adapter.go
Signals: N/A
Excerpt (<=80 chars):  type adapter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter
- factory
- GetMetadataFile
- GetPackage
- newAdapter
- Create
- init
```

--------------------------------------------------------------------------------

---[FILE: client.go]---
Location: harness-main/registry/app/remote/clients/registry/client.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Client
- init
- NewClient
- NewClientWithAuthorizer
- Ping
- Catalog
- ListTags
- ManifestExist
- PullManifest
- PushManifest
- DeleteManifest
- BlobExist
- PullBlob
- PullBlobChunk
- PushBlob
```

--------------------------------------------------------------------------------

---[FILE: client_test.go]---
Location: harness-main/registry/app/remote/clients/registry/client_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestBuildFileURL(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestBuildFileURL
- TestBuildFileURL_PathTraversalSafety
- TestBuildFileURL_PreservesURLComponents
- BenchmarkBuildFileURL
- BenchmarkBuildFileURL_WithTraversal
```

--------------------------------------------------------------------------------

---[FILE: authorizer.go]---
Location: harness-main/registry/app/remote/clients/registry/auth/authorizer.go
Signals: N/A
Excerpt (<=80 chars): func NewAuthorizer(username, password string, insecure, isOCI bool) lib.Autho...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authorizer
- NewAuthorizer
- Modify
- initialize
- isTarget
```

--------------------------------------------------------------------------------

---[FILE: authorizer.go]---
Location: harness-main/registry/app/remote/clients/registry/auth/basic/authorizer.go
Signals: N/A
Excerpt (<=80 chars): func NewAuthorizer(username, password string) lib.Authorizer {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authorizer
- NewAuthorizer
- Modify
```

--------------------------------------------------------------------------------

---[FILE: authorizer_test.go]---
Location: harness-main/registry/app/remote/clients/registry/auth/basic/authorizer_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestModify(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestModify
```

--------------------------------------------------------------------------------

---[FILE: authorizer.go]---
Location: harness-main/registry/app/remote/clients/registry/auth/bearer/authorizer.go
Signals: N/A
Excerpt (<=80 chars): func NewAuthorizer(realm, service string, a lib.Authorizer, transport http.Ro...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authorizer
- token
- NewAuthorizer
- Modify
- getToken
- fetchToken
```

--------------------------------------------------------------------------------

---[FILE: cache.go]---
Location: harness-main/registry/app/remote/clients/registry/auth/bearer/cache.go
Signals: N/A
Excerpt (<=80 chars): func newCache(capacity int, latency int) *cache {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cache
- newCache
- get
- set
- key
- expired
```

--------------------------------------------------------------------------------

---[FILE: scope.go]---
Location: harness-main/registry/app/remote/clients/registry/auth/bearer/scope.go
Signals: N/A
Excerpt (<=80 chars):  type scope struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- scope
- String
- parseScopes
```

--------------------------------------------------------------------------------

---[FILE: authorizer.go]---
Location: harness-main/registry/app/remote/clients/registry/auth/null/authorizer.go
Signals: N/A
Excerpt (<=80 chars): func NewAuthorizer() lib.Authorizer {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authorizer
- NewAuthorizer
- Modify
```

--------------------------------------------------------------------------------

---[FILE: interceptor.go]---
Location: harness-main/registry/app/remote/clients/registry/interceptor/interceptor.go
Signals: N/A
Excerpt (<=80 chars): type Interceptor interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Interceptor
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/remote/controller/proxy/controller.go
Signals: N/A
Excerpt (<=80 chars): type Controller interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManifestList
- ManifestCache
- ManifestListCache
- ManifestCacheHandler
- NewProxyController
- EnsureTag
- UseLocalBlob
- UseLocalManifest
- ByteToReadCloser
- ProxyManifest
- HeadManifest
- ProxyBlob
- putBlobToLocal
- waitAndPushManifest
- getRemoteRepo
- getReference
```

--------------------------------------------------------------------------------

---[FILE: inflight.go]---
Location: harness-main/registry/app/remote/controller/proxy/inflight.go
Signals: N/A
Excerpt (<=80 chars):  type inflightRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inflightRequest
- addRequest
- removeRequest
```

--------------------------------------------------------------------------------

---[FILE: inflight_test.go]---
Location: harness-main/registry/app/remote/controller/proxy/inflight_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestInflightRequest(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestInflightRequest
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/remote/controller/proxy/local.go
Signals: N/A
Excerpt (<=80 chars): type registryInterface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registryInterface
- registryManifestInterface
```

--------------------------------------------------------------------------------

---[FILE: remote.go]---
Location: harness-main/registry/app/remote/controller/proxy/remote.go
Signals: N/A
Excerpt (<=80 chars): type RemoteInterface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteInterface
- remoteHelper
- NewRemoteHelper
- init
- BlobReader
- Manifest
- ManifestExist
- ListTags
- GetImageName
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/remote/controller/proxy/maven/controller.go
Signals: N/A
Excerpt (<=80 chars):  type controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewProxyController
- UseLocalFile
- ProxyFile
- putFileToLocal
```

--------------------------------------------------------------------------------

---[FILE: local.go]---
Location: harness-main/registry/app/remote/controller/proxy/maven/local.go
Signals: N/A
Excerpt (<=80 chars):  type registryInterface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registryInterface
```

--------------------------------------------------------------------------------

---[FILE: remote.go]---
Location: harness-main/registry/app/remote/controller/proxy/maven/remote.go
Signals: N/A
Excerpt (<=80 chars): type RemoteInterface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteInterface
- remoteHelper
- NewRemoteHelper
- init
- GetFile
- HeadFile
```

--------------------------------------------------------------------------------

---[FILE: cargo.go]---
Location: harness-main/registry/app/remote/registry/cargo.go
Signals: N/A
Excerpt (<=80 chars):  type CargoRegistry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CargoRegistry
```

--------------------------------------------------------------------------------

---[FILE: generic.go]---
Location: harness-main/registry/app/remote/registry/generic.go
Signals: N/A
Excerpt (<=80 chars):  type GenericRegistry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericRegistry
```

--------------------------------------------------------------------------------

---[FILE: gopackage.go]---
Location: harness-main/registry/app/remote/registry/gopackage.go
Signals: N/A
Excerpt (<=80 chars):  type GoPackageRegistry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoPackageRegistry
```

--------------------------------------------------------------------------------

---[FILE: npm.go]---
Location: harness-main/registry/app/remote/registry/npm.go
Signals: N/A
Excerpt (<=80 chars):  type NpmRegistry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NpmRegistry
```

--------------------------------------------------------------------------------

---[FILE: nuget.go]---
Location: harness-main/registry/app/remote/registry/nuget.go
Signals: N/A
Excerpt (<=80 chars):  type NugetRegistry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NugetRegistry
```

--------------------------------------------------------------------------------

---[FILE: python.go]---
Location: harness-main/registry/app/remote/registry/python.go
Signals: N/A
Excerpt (<=80 chars):  type PythonRegistry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PythonRegistry
```

--------------------------------------------------------------------------------

---[FILE: rpm.go]---
Location: harness-main/registry/app/remote/registry/rpm.go
Signals: N/A
Excerpt (<=80 chars):  type RpmRegistry interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RpmRegistry
```

--------------------------------------------------------------------------------

---[FILE: public_access.go]---
Location: harness-main/registry/app/services/publicaccess/public_access.go
Signals: N/A
Excerpt (<=80 chars):  type CacheService interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CacheService
- CacheKey
- publicAccessCacheGetter
- NewPublicAccessService
- NewPublicAccessCacheCache
- Get
- Set
- Delete
- IsPublicAccessSupported
- MarkChanged
- Find
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/services/publicaccess/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideEvictorPublicAccess(pubsub pubsub.PubSub) cache2.Evictor[*CacheK...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideEvictorPublicAccess
- ProvidePublicAccessCache
- ProvideRegistryPublicAccess
```

--------------------------------------------------------------------------------

---[FILE: reg_finder.go]---
Location: harness-main/registry/app/services/refcache/reg_finder.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryFinder interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryFinder
- NewRegistryFinder
- MarkChanged
- FindByID
- FindByRootRef
- FindByRootParentID
- Update
- Delete
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/services/refcache/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideRegistryFinder(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideRegistryFinder
```

--------------------------------------------------------------------------------

---[FILE: blobs.go]---
Location: harness-main/registry/app/storage/blobs.go
Signals: N/A
Excerpt (<=80 chars): type BlobInvalidDigestError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlobInvalidDigestError
- BlobMountedError
- BlobWriter
- OciBlobStore
- GenericBlobStore
- Error
```

--------------------------------------------------------------------------------

---[FILE: blobStore.go]---
Location: harness-main/registry/app/storage/blobStore.go
Signals: N/A
Excerpt (<=80 chars):  type genericBlobStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- genericBlobStore
- Get
- GetWithNoRedirect
- Create
- newBlobUpload
- Write
- Move
- Delete
- Stat
```

--------------------------------------------------------------------------------

---[FILE: blobwriter.go]---
Location: harness-main/registry/app/storage/blobwriter.go
Signals: N/A
Excerpt (<=80 chars): type blobWriter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- blobWriter
- ID
- Commit
- Cancel
- Size
- Write
- Close
- validateBlob
- moveBlob
- removeResources
- Reader
```

--------------------------------------------------------------------------------

---[FILE: blobwriter_resumable.go]---
Location: harness-main/registry/app/storage/blobwriter_resumable.go
Signals: N/A
Excerpt (<=80 chars): func (bw *blobWriter) resumeDigest(ctx context.Context) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hashStateEntry
- resumeDigest
- getStoredHashStates
- storeHashState
```

--------------------------------------------------------------------------------

---[FILE: errors.go]---
Location: harness-main/registry/app/storage/errors.go
Signals: N/A
Excerpt (<=80 chars): type TagUnknownError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagUnknownError
- RegistryUnknownError
- RegistryNameInvalidError
- ManifestUnknownError
- ManifestUnknownRevisionError
- ManifestUnverifiedError
- ManifestReferencesExceedLimitError
- ManifestPayloadSizeExceedsLimitError
- ManifestBlobUnknownError
- ManifestNameInvalidError
- Error
```

--------------------------------------------------------------------------------

---[FILE: filereader.go]---
Location: harness-main/registry/app/storage/filereader.go
Signals: N/A
Excerpt (<=80 chars): type FileReader struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileReader
- NewFileReader
- Read
- Seek
- Close
- reader
- reset
- closeWithErr
```

--------------------------------------------------------------------------------

---[FILE: gcstoragelient.go]---
Location: harness-main/registry/app/storage/gcstoragelient.go
Signals: N/A
Excerpt (<=80 chars):  type GcStorageClient struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GcStorageClient
- NewGcStorageClient
- RemoveBlob
```

--------------------------------------------------------------------------------

---[FILE: io.go]---
Location: harness-main/registry/app/storage/io.go
Signals: N/A
Excerpt (<=80 chars):  func getContent(ctx context.Context, driver driver.StorageDriver, p string) ...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- limitedReader
- getContent
- readAllLimited
- limitReader
- Read
```

--------------------------------------------------------------------------------

---[FILE: middleware.go]---
Location: harness-main/registry/app/storage/middleware.go
Signals: N/A
Excerpt (<=80 chars): func GetRegistryOptions() []Option {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRegistryOptions
```

--------------------------------------------------------------------------------

---[FILE: ociblobstore.go]---
Location: harness-main/registry/app/storage/ociblobstore.go
Signals: N/A
Excerpt (<=80 chars):  type ociBlobStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ociBlobStore
- Path
- Create
- Resume
- Delete
- ServeBlobInternal
- Get
- Open
- Put
- Stat
- newBlobUpload
```

--------------------------------------------------------------------------------

---[FILE: paths.go]---
Location: harness-main/registry/app/storage/paths.go
Signals: N/A
Excerpt (<=80 chars):  func pathFor(spec pathSpec) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pathSpec
- blobsPathSpec
- blobPathSpec
- blobDataPathSpec
- uploadDataPathSpec
- uploadFilePathSpec
- uploadHashStatePathSpec
- repositoriesRootPathSpec
- pathFor
- digestPathComponents
- BlobPath
```

--------------------------------------------------------------------------------

---[FILE: storageservice.go]---
Location: harness-main/registry/app/storage/storageservice.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnableRedirect
- EnableDelete
- NewStorageService
- OciBlobsStore
- GenericBlobsStore
- PathFn
```

--------------------------------------------------------------------------------

---[FILE: database.go]---
Location: harness-main/registry/app/store/database.go
Signals: N/A
Excerpt (<=80 chars):  type MediaTypesRepository interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MediaTypesRepository
- BlobRepository
- CleanupPolicyRepository
- ManifestRepository
- ManifestReferenceRepository
- OCIImageIndexMappingRepository
- LayerRepository
- TagRepository
- UpstreamProxyConfig
- UpstreamProxyConfigRepository
- RegistryMetadata
- RegistryRepository
- RegistryBlobRepository
- ImageRepository
- ArtifactRepository
- DownloadStatRepository
- BandwidthStatRepository
- GCBlobTaskRepository
```

--------------------------------------------------------------------------------

---[FILE: reg_id.go]---
Location: harness-main/registry/app/store/cache/reg_id.go
Signals: N/A
Excerpt (<=80 chars):  func NewRegistryIDCache(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registryIDCacheGetter
- NewRegistryIDCache
- Find
```

--------------------------------------------------------------------------------

---[FILE: reg_root_ref.go]---
Location: harness-main/registry/app/store/cache/reg_root_ref.go
Signals: N/A
Excerpt (<=80 chars):  func NewRegistryRootRefCache(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registryRootRefCacheGetter
- NewRegistryRootRefCache
- Find
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/store/cache/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideEvictorRegistryCore(pubsub pubsub.PubSub) cache.Evictor[*types.R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideEvictorRegistryCore
- ProvideRegistryIDCache
- ProvideRegRootRefCache
```

--------------------------------------------------------------------------------

---[FILE: artifact.go]---
Location: harness-main/registry/app/store/database/artifact.go
Signals: N/A
Excerpt (<=80 chars):  type ArtifactDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactDao
- artifactDB
- nonOCIArtifactMetadataDB
- downloadCountResult
- NewArtifactDao
- GetByName
- GetByRegistryImageAndVersion
- GetByRegistryIDAndImage
- GetLatestByImageID
- CreateOrUpdate
- Count
- DuplicateArtifact
- DeleteByImageNameAndRegistryID
- DeleteByVersionAndImageName
- mapToInternalArtifact
- mapToArtifact
- SearchLatestByName
- CountLatestByName
```

--------------------------------------------------------------------------------

---[FILE: bandwidth_stat.go]---
Location: harness-main/registry/app/store/database/bandwidth_stat.go
Signals: N/A
Excerpt (<=80 chars):  type BandwidthStatDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BandwidthStatDao
- bandwidthStatDB
- NewBandwidthStatDao
- Create
- mapToInternalBandwidthStat
```

--------------------------------------------------------------------------------

---[FILE: blob.go]---
Location: harness-main/registry/app/store/database/blob.go
Signals: N/A
Excerpt (<=80 chars):  type blobDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- blobDao
- blobDB
- blobMetadataDB
- NewBlobDao
- FindByDigestAndRootParentID
- TotalSizeByRootParentID
- FindByID
- FindByDigestAndRepoID
- CreateOrFind
- DeleteByID
- ExistsBlob
- mapToInternalBlob
- mapToBlob
```

--------------------------------------------------------------------------------

---[FILE: cleanup_policy.go]---
Location: harness-main/registry/app/store/database/cleanup_policy.go
Signals: N/A
Excerpt (<=80 chars):  type CleanupPolicyDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CleanupPolicyDao
- CleanupPolicyDB
- CleanupPolicyPrefixMappingDB
- CleanupPolicyJoinMapping
- NewCleanupPolicyDao
- GetIDsByRegistryID
- GetByRegistryID
- Create
- createPrefixMapping
- Delete
- deleteCleanupPolicies
- ModifyCleanupPolicies
- createPrefixMappingsInternal
- mapToInternalCleanupPolicyMapping
- mapToInternalCleanupPolicy
- mapToCleanupPolicies
```

--------------------------------------------------------------------------------

---[FILE: download_stat.go]---
Location: harness-main/registry/app/store/database/download_stat.go
Signals: N/A
Excerpt (<=80 chars):  type DownloadStatDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadStatDao
- downloadStatDB
- versionsCountDB
- NewDownloadStatDao
- Create
- CreateByRegistryIDImageAndArtifactName
- GetTotalDownloadsForImage
- GetTotalDownloadsForArtifactID
- GetTotalDownloadsForManifests
- mapToInternalDownloadStat
```

--------------------------------------------------------------------------------

---[FILE: generic_blob.go]---
Location: harness-main/registry/app/store/database/generic_blob.go
Signals: N/A
Excerpt (<=80 chars):  type GenericBlobDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericBlobDao
- GenericBlob
- FindByID
- TotalSizeByRootParentID
- FindBySha256AndRootParentID
- Create
- DeleteByID
- mapToGenericBlob
- mapToInternalGenericBlob
- NewGenericBlobDao
```

--------------------------------------------------------------------------------

---[FILE: image.go]---
Location: harness-main/registry/app/store/database/image.go
Signals: N/A
Excerpt (<=80 chars):  type ImageDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImageDao
- imageDB
- imageLabelDB
- NewImageDao
- Get
- DeleteByImageNameAndRegID
- DeleteByImageNameIfNoLinkedArtifacts
- GetByName
- GetByNameAndType
- CreateOrUpdate
- GetLabelsByParentIDAndRepo
- CountLabelsByParentIDAndRepo
- GetByRepoAndName
- Update
- UpdateStatus
- DuplicateImage
- mapToInternalImage
- mapToImage
```

--------------------------------------------------------------------------------

---[FILE: layer.go]---
Location: harness-main/registry/app/store/database/layer.go
Signals: N/A
Excerpt (<=80 chars):  type layersDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- layersDao
- layersDB
- NewLayersDao
- AssociateLayerBlob
- GetAllLayersByManifestID
- mapToLayer
- mapToInternalLayer
```

--------------------------------------------------------------------------------

---[FILE: manifest.go]---
Location: harness-main/registry/app/store/database/manifest.go
Signals: N/A
Excerpt (<=80 chars):  type manifestDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manifestDao
- manifestDB
- manifestMetadataDB
- NewManifestDao
- FindAll
- Count
- LayerBlobs
- References
- Create
- CreateOrFind
- AssociateLayerBlob
- DissociateLayerBlob
- Delete
- DeleteManifest
- DeleteManifestByImageName
- FindManifestByID
- FindManifestByDigest
- ListManifestsBySubjectDigest
```

--------------------------------------------------------------------------------

---[FILE: manifest_reference.go]---
Location: harness-main/registry/app/store/database/manifest_reference.go
Signals: N/A
Excerpt (<=80 chars):  type manifestReferenceDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manifestReferenceDao
- manifestReferenceDB
- NewManifestReferenceDao
- AssociateManifest
- DissociateManifest
- mapToInternalManifestReference
```

--------------------------------------------------------------------------------

---[FILE: mediatype.go]---
Location: harness-main/registry/app/store/database/mediatype.go
Signals: N/A
Excerpt (<=80 chars):  type mediaTypesDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mediaTypesDao
- mediaTypeDB
- NewMediaTypesDao
- MediaTypeExists
- GetMediaTypeByID
- mapToMediaType
- MapMediaType
```

--------------------------------------------------------------------------------

---[FILE: node.go]---
Location: harness-main/registry/app/store/database/node.go
Signals: N/A
Excerpt (<=80 chars):  type NodeDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeDao
- Nodes
- FileNodeMetadataDB
- GetByPathAndRegistryID
- FindByPathsAndRegistryID
- Get
- GetByNameAndRegistryID
- GetByBlobIDAndRegistryID
- FindByPathAndRegistryID
- CountByPathAndRegistryID
- Create
- DeleteByID
- DeleteByNodePathAndRegistryID
- DeleteByLeafNodePathAndRegistryID
- GetAllFileNodesByPathPrefixAndRegistryID
- mapToNode
- mapToInternalNode
- GetFilesMetadataByPathAndRegistryID
```

--------------------------------------------------------------------------------

---[FILE: oci_image_index_mapping.go]---
Location: harness-main/registry/app/store/database/oci_image_index_mapping.go
Signals: N/A
Excerpt (<=80 chars):  type ociImageIndexMappingDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ociImageIndexMappingDao
- ociImageIndexMappingDB
- NewOCIImageIndexMappingDao
- Create
- GetAllByChildDigest
- mapToInternalOCIMapping
- mapToExternalOCIManifest
```

--------------------------------------------------------------------------------

---[FILE: package_tag.go]---
Location: harness-main/registry/app/store/database/package_tag.go
Signals: N/A
Excerpt (<=80 chars):  type PackageTagDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageTagDao
- PackageTagDB
- PackageTagMetadataDB
- NewPackageTagDao
- FindByImageNameAndRegID
- DeleteByTagAndImageName
- DeleteByImageNameAndRegID
- Create
- mapToPackageTagList
- mapToPackageTag
- mapToInternalPackageTag
```

--------------------------------------------------------------------------------

---[FILE: quarantine_artifact.go]---
Location: harness-main/registry/app/store/database/quarantine_artifact.go
Signals: N/A
Excerpt (<=80 chars):  type QuarantineArtifactDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QuarantineArtifactDao
- QuarantineArtifactDB
- NewQuarantineArtifactDao
- GetByFilePath
- Create
- mapToQuarantineArtifact
- mapToQuarantineArtifactList
- mapToInternalQuarantineArtifact
- DeleteByRegistryIDArtifactAndFilePath
```

--------------------------------------------------------------------------------

---[FILE: registry.go]---
Location: harness-main/registry/app/store/database/registry.go
Signals: N/A
Excerpt (<=80 chars):  type registryDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registryDao
- registryDB
- registryNameID
- RegistryMetadataDB
- result
- NewRegistryDao
- Get
- GetByParentIDAndName
- GetByRootParentIDAndName
- Count
- FetchUpstreamProxyKeys
- GetByIDIn
- GetAll
- fetchArtifactCounts
- fetchOCIBlobSizes
```

--------------------------------------------------------------------------------

---[FILE: registry_blobs.go]---
Location: harness-main/registry/app/store/database/registry_blobs.go
Signals: N/A
Excerpt (<=80 chars):  type registryBlobDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registryBlobDao
- registryBlobDB
- NewRegistryBlobDao
- LinkBlob
- UnlinkBlob
- UnlinkBlobByImageName
- mapToInternalRegistryBlob
```

--------------------------------------------------------------------------------

---[FILE: tag.go]---
Location: harness-main/registry/app/store/database/tag.go
Signals: N/A
Excerpt (<=80 chars):  type tagDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tagDao
- tagDB
- artifactMetadataDB
- tagMetadataDB
- ociVersionMetadataDB
- tagDetailDB
- tagInfoDB
- enrichmentData
- enrichmentRow
- quarantineResult
- NewTagDao
- CreateOrUpdate
- LockTagByNameForUpdate
- DeleteTagByName
- DeleteTagByManifestID
- TagsPaginated
- HasTagsAfterName
```

--------------------------------------------------------------------------------

---[FILE: task.go]---
Location: harness-main/registry/app/store/database/task.go
Signals: N/A
Excerpt (<=80 chars):  func NewTaskStore(db *sqlx.DB, tx dbtx.Transactor) store.TaskRepository {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- taskStore
- TaskDB
- NewTaskStore
- Find
- UpsertTask
- UpdateStatus
- SetRunAgain
- LockForUpdate
- CompleteTask
- ListPendingTasks
- ToTask
```

--------------------------------------------------------------------------------

---[FILE: task_event_store.go]---
Location: harness-main/registry/app/store/database/task_event_store.go
Signals: N/A
Excerpt (<=80 chars):  type taskEventStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- taskEventStore
- NewTaskEventStore
- LogTaskEvent
```

--------------------------------------------------------------------------------

---[FILE: task_source_store.go]---
Location: harness-main/registry/app/store/database/task_source_store.go
Signals: N/A
Excerpt (<=80 chars):  type taskSourceStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- taskSourceStore
- TaskSourceDB
- NewTaskSourceStore
- InsertSource
- ClaimSources
- UpdateSourceStatus
- ToTaskSource
- ToSourceRef
```

--------------------------------------------------------------------------------

---[FILE: upstream_proxy.go]---
Location: harness-main/registry/app/store/database/upstream_proxy.go
Signals: N/A
Excerpt (<=80 chars):  type UpstreamproxyDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpstreamproxyDao
- upstreamProxyConfigDB
- upstreamProxyDB
- NewUpstreamproxyDao
- getUpstreamProxyQuery
- Get
- GetByRegistryIdentifier
- GetByParentID
- Create
- Update
- GetAll
- CountAll
- mapToInternalUpstreamProxy
- mapToUpstreamProxy
- mapToUpstreamProxyList
```

--------------------------------------------------------------------------------

---[FILE: webhook.go]---
Location: harness-main/registry/app/store/database/webhook.go
Signals: N/A
Excerpt (<=80 chars):  func NewWebhookDao(db *sqlx.DB) store.WebhooksRepository {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhookDB
- WebhookDao
- NewWebhookDao
- Create
- GetByRegistryAndIdentifier
- Find
- ListByRegistry
- ListAllByRegistry
- CountAllByRegistry
- Update
- DeleteByRegistryAndIdentifier
- UpdateOptLock
- mapToWebhookDB
- mapToWebhook
- selectWebhookParents
- triggersToString
- triggersFromString
- structListToString
```

--------------------------------------------------------------------------------

---[FILE: webhookexecution.go]---
Location: harness-main/registry/app/store/database/webhookexecution.go
Signals: N/A
Excerpt (<=80 chars):  type WebhookExecutionDao struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookExecutionDao
- webhookExecutionDB
- Find
- Create
- ListForWebhook
- CountForWebhook
- ListForTrigger
- NewWebhookExecutionDao
- mapToWebhookExecution
- mapToWebhookExecutionDB
- mapToWebhookExecutions
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/store/database/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideUpstreamDao(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideUpstreamDao
- ProvideMediaTypeDao
- ProvideBlobDao
- ProvideRegistryBlobDao
- ProvideImageDao
- ProvideArtifactDao
- ProvideDownloadStatDao
- ProvideBandwidthStatDao
- ProvideTagDao
- ProvideManifestDao
- ProvideWebhookDao
- ProvideWebhookExecutionDao
- ProvideManifestRefDao
- ProvideOCIImageIndexMappingDao
- ProvideLayerDao
- ProvideCleanupPolicyDao
- ProvideNodeDao
- ProvideQuarantineArtifactDao
```

--------------------------------------------------------------------------------

---[FILE: errors.go]---
Location: harness-main/registry/app/store/database/util/errors.go
Signals: N/A
Excerpt (<=80 chars): type UnknownMediaTypeError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnknownMediaTypeError
- Error
```

--------------------------------------------------------------------------------

---[FILE: mapper.go]---
Location: harness-main/registry/app/store/database/util/mapper.go
Signals: N/A
Excerpt (<=80 chars):  func StringToArr(s string) []string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StringToArr
- ArrToString
- Int64ArrToString
- StringToInt64Arr
- StringToArrByDelimiter
- ArrToStringByDelimiter
- Int64ArrToStringByDelimiter
- StringToInt64ArrByDelimiter
- GetSetDBKeys
- GetDBTagsFromStruct
- GetHexDecodedBytes
- GetHexEncodedString
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/store/database/util/utils.go
Signals: N/A
Excerpt (<=80 chars):  func GetEmptySQLString(str string) sql.NullString {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetEmptySQLString
- GetEmptySQLInt64
- ConstructQuery
- FormatQuery
- SafeIntToUInt64
- MinInt
```

--------------------------------------------------------------------------------

---[FILE: migrator.go]---
Location: harness-main/registry/app/store/migrations/migrator.go
Signals: N/A
Excerpt (<=80 chars): func Migrate(m *migrate.Migrate) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Migrate
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/registry/app/utils/cargo/helper.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryHelper
- NewRegistryHelper
- GetIndexFilePathFromImageName
- UpdatePackageIndex
- regeneratePackageIndex
- uploadIndexMetadata
- mapVersionDependenciesToIndexDependencies
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/utils/cargo/wire.go
Signals: N/A
Excerpt (<=80 chars):  func LocalRegistryHelperProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelperProvider
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/registry/app/utils/gopackage/helper.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryHelper
- NewRegistryHelper
- UpdatePackageIndex
- regeneratePackageIndex
- uploadIndexMetadata
- UpdatePackageMetadata
- regeneratePackageMetadata
- updatePackageMetadataFromInfoFile
- updatePackageMetadataFromModFile
- updatePackageMetadataFromZipFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/utils/gopackage/wire.go
Signals: N/A
Excerpt (<=80 chars):  func LocalRegistryHelperProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalRegistryHelperProvider
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/registry/app/utils/rpm/helper.go
Signals: N/A
Excerpt (<=80 chars):  func ParsePackage(r io.Reader) (*rpmtypes.Package, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParsePackage
- getString
- getUInt64
- getEntries
- getFiles
- getChangelogs
```

--------------------------------------------------------------------------------

---[FILE: types.go]---
Location: harness-main/registry/app/utils/rpm/types/types.go
Signals: N/A
Excerpt (<=80 chars):  type PrimaryVersion struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrimaryVersion
- PrimaryChecksum
- PrimaryTimes
- PrimarySizes
- PrimaryLocation
- PrimaryEntryList
- PrimaryFormat
- PrimaryPackage
- OtherVersion
- OtherPackage
- FileListVersion
- FileListPackage
- Repomd
- RepoChecksum
- RepoLocation
- RepoData
- PackageInfo
- Package
```

--------------------------------------------------------------------------------

---[FILE: helper.go]---
Location: harness-main/registry/config/helper.go
Signals: N/A
Excerpt (<=80 chars):  func GetS3StorageParameters(c *types.Config) map[string]any {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetS3StorageParameters
- GetFilesystemParams
```

--------------------------------------------------------------------------------

---[FILE: docs.go]---
Location: harness-main/registry/docs/docs.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

````
