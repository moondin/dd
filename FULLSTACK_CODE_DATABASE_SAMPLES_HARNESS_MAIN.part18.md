---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 18
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 18 of 37)

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

---[FILE: utils_test.go]---
Location: harness-main/registry/app/api/controller/metadata/utils_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestValidateIdentifier(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestValidateIdentifier
- TestCleanURLPath
- TestGetTimeInMs
- TestGetPullCommand
- TestGetDockerPullCommand
- TestGetHelmPullCommand
- TestGetErrorResponse
- TestGetSortByOrder
- TestGetSortByField
- TestGetPageLimit
- TestGetOffset
- TestGetPageNumber
- TestGetSuccessResponse
- TestGetPageCount
- TestGetRegistryRef
- TestGetRepoURLWithoutProtocol
- TestGetTagURL
```

--------------------------------------------------------------------------------

---[FILE: artifact_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/artifact_repository.go
Signals: N/A
Excerpt (<=80 chars): type ArtifactRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactRepository
- Count
- CountAllArtifactsByParentID
- CountAllVersionsByRepoAndImage
- CountArtifactsByRepo
- CountByImageName
- CountLatestByName
- CreateOrUpdate
- DeleteByImageNameAndRegistryID
- DeleteByVersionAndImageName
- DuplicateArtifact
- GetAllArtifactsByParentID
- GetAllArtifactsByRepo
- GetAllVersionsByRepoAndImage
- GetArtifactMetadata
- GetArtifactsByRepo
- GetArtifactsByRepoAndImageBatch
- GetByName
```

--------------------------------------------------------------------------------

---[FILE: audit_service.go]---
Location: harness-main/registry/app/api/controller/mocks/audit_service.go
Signals: N/A
Excerpt (<=80 chars): type AuditService struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuditService
- Log
```

--------------------------------------------------------------------------------

---[FILE: authorizer.go]---
Location: harness-main/registry/app/api/controller/mocks/authorizer.go
Signals: N/A
Excerpt (<=80 chars): type Authorizer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Authorizer
- Check
- CheckAll
```

--------------------------------------------------------------------------------

---[FILE: blob_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/blob_repository.go
Signals: N/A
Excerpt (<=80 chars): type BlobRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlobRepository
- CreateOrFind
- DeleteByID
- ExistsBlob
- FindByDigestAndRepoID
- FindByDigestAndRootParentID
- FindByID
- TotalSizeByRootParentID
- NewBlobRepository
```

--------------------------------------------------------------------------------

---[FILE: cleanup_policy_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/cleanup_policy_repository.go
Signals: N/A
Excerpt (<=80 chars): type CleanupPolicyRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CleanupPolicyRepository
- CleanupPolicyRepository_Expecter
- CleanupPolicyRepository_Create_Call
- CleanupPolicyRepository_Delete_Call
- CleanupPolicyRepository_GetByRegistryID_Call
- CleanupPolicyRepository_GetIDsByRegistryID_Call
- CleanupPolicyRepository_ModifyCleanupPolicies_Call
- EXPECT
- Create
- Run
- Return
- RunAndReturn
- Delete
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/mocks/controller.go
Signals: N/A
Excerpt (<=80 chars): type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
- GetPackageMetadata
- UploadPackageFile
- NewController
```

--------------------------------------------------------------------------------

---[FILE: download_stat_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/download_stat_repository.go
Signals: N/A
Excerpt (<=80 chars): func NewMockDownloadStatRepository(t interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockDownloadStatRepository
- MockDownloadStatRepository_Expecter
- MockDownloadStatRepository_Create_Call
- MockDownloadStatRepository_CreateByRegistryIDImageAndArtifactName_Call
- MockDownloadStatRepository_GetTotalDownloadsForArtifactID_Call
- MockDownloadStatRepository_GetTotalDownloadsForImage_Call
- MockDownloadStatRepository_GetTotalDownloadsForManifests_Call
- NewMockDownloadStatRepository
- EXPECT
- Create
- Run
- Return
- RunAndReturn
- CreateByRegistryIDImageAndArtifactName
```

--------------------------------------------------------------------------------

---[FILE: file_manager.go]---
Location: harness-main/registry/app/api/controller/mocks/file_manager.go
Signals: N/A
Excerpt (<=80 chars): type FileManager struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileManager
- UploadFile
- DownloadFile
- DeleteFile
- HeadFile
- GetFileMetadata
- DeleteFileByRegistryID
- GetFilesMetadata
- CountFilesByPath
```

--------------------------------------------------------------------------------

---[FILE: generic_blob_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/generic_blob_repository.go
Signals: N/A
Excerpt (<=80 chars): type GenericBlobRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericBlobRepository
- Create
- DeleteByID
- FindByID
- FindBySha256AndRootParentID
- TotalSizeByRootParentID
- NewGenericBlobRepository
```

--------------------------------------------------------------------------------

---[FILE: image_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/image_repository.go
Signals: N/A
Excerpt (<=80 chars): type ImageRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImageRepository
- ImageRepository_Expecter
- ImageRepository_CountLabelsByParentIDAndRepo_Call
- ImageRepository_CreateOrUpdate_Call
- ImageRepository_DeleteByImageNameAndRegID_Call
- ImageRepository_DeleteByImageNameIfNoLinkedArtifacts_Call
- ImageRepository_DuplicateImage_Call
- ImageRepository_Get_Call
- ImageRepository_GetByName_Call
- ImageRepository_GetByNameAndType_Call
- ImageRepository_GetByRepoAndName_Call
- ImageRepository_GetLabelsByParentIDAndRepo_Call
- ImageRepository_Update_Call
- ImageRepository_UpdateStatus_Call
- EXPECT
- CountLabelsByParentIDAndRepo
- Run
```

--------------------------------------------------------------------------------

---[FILE: image_store.go]---
Location: harness-main/registry/app/api/controller/mocks/image_store.go
Signals: N/A
Excerpt (<=80 chars): type ImageStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImageStore
- Get
- GetByName
- GetLabelsByParentIDAndRepo
- CountLabelsByParentIDAndRepo
- GetByRepoAndName
- CreateOrUpdate
- Update
- UpdateStatus
- DeleteByRegistryID
- DeleteBandwidthStatByRegistryID
- DeleteDownloadStatByRegistryID
```

--------------------------------------------------------------------------------

---[FILE: manifest_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/manifest_repository.go
Signals: N/A
Excerpt (<=80 chars): type ManifestRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManifestRepository
- AssociateLayerBlob
- Count
- Create
- CreateOrFind
- Delete
- DeleteManifest
- DissociateLayerBlob
- FindAll
- FindManifestByDigest
- FindManifestByTagName
- FindManifestPayloadByTagName
- Get
- GetManifestPayload
- LayerBlobs
- ListManifestsBySubject
- ListManifestsBySubjectDigest
- References
```

--------------------------------------------------------------------------------

---[FILE: package_wrapper.go]---
Location: harness-main/registry/app/api/controller/mocks/package_wrapper.go
Signals: N/A
Excerpt (<=80 chars): func NewMockPackageWrapper(t interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockPackageWrapper
- MockPackageWrapper_Expecter
- MockPackageWrapper_DeleteArtifact_Call
- MockPackageWrapper_DeleteArtifactVersion_Call
- MockPackageWrapper_GetArtifactDetail_Call
- MockPackageWrapper_GetArtifactMetadata_Call
- MockPackageWrapper_GetArtifactVersionMetadata_Call
- MockPackageWrapper_GetClientSetupDetails_Call
- MockPackageWrapper_GetFileMetadata_Call
- MockPackageWrapper_GetFilePath_Call
- MockPackageWrapper_GetPackageURL_Call
- MockPackageWrapper_IsURLRequiredForUpstreamSource_Call
- MockPackageWrapper_IsValidPackageType_Call
- MockPackageWrapper_IsValidPackageTypes_Call
- MockPackageWrapper_IsValidRepoType_Call
- MockPackageWrapper_IsValidRepoTypes_Call
- MockPackageWrapper_IsValidUpstreamSource_Call
- MockPackageWrapper_IsValidUpstreamSources_Call
```

--------------------------------------------------------------------------------

---[FILE: public_access_cache.go]---
Location: harness-main/registry/app/api/controller/mocks/public_access_cache.go
Signals: N/A
Excerpt (<=80 chars): type MockPublicAccess struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockPublicAccess
- NewMockPublicAccess
- Get
- Set
- Delete
- IsPublicAccessSupported
- MarkChanged
- ExpectGet
- ExpectSet
- ExpectDelete
- ExpectIsPublicAccessSupported
- ExpectMarkChanged
```

--------------------------------------------------------------------------------

---[FILE: quarantine_artifact_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/quarantine_artifact_repository.go
Signals: N/A
Excerpt (<=80 chars): func NewMockQuarantineArtifactRepository(t interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockQuarantineArtifactRepository
- MockQuarantineArtifactRepository_Expecter
- MockQuarantineArtifactRepository_Create_Call
- MockQuarantineArtifactRepository_DeleteByRegistryIDArtifactAndFilePath_Call
- MockQuarantineArtifactRepository_GetByFilePath_Call
- NewMockQuarantineArtifactRepository
- EXPECT
- Create
- Run
- Return
- RunAndReturn
- DeleteByRegistryIDArtifactAndFilePath
- GetByFilePath
```

--------------------------------------------------------------------------------

---[FILE: registry_finder.go]---
Location: harness-main/registry/app/api/controller/mocks/registry_finder.go
Signals: N/A
Excerpt (<=80 chars): type RegistryFinder struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryFinder
- RegistryFinder_Expecter
- RegistryFinder_Delete_Call
- RegistryFinder_FindByID_Call
- RegistryFinder_FindByRootParentID_Call
- RegistryFinder_FindByRootRef_Call
- RegistryFinder_MarkChanged_Call
- RegistryFinder_Update_Call
- EXPECT
- Delete
- Run
- Return
- RunAndReturn
- FindByID
```

--------------------------------------------------------------------------------

---[FILE: registry_metadata_helper.go]---
Location: harness-main/registry/app/api/controller/mocks/registry_metadata_helper.go
Signals: N/A
Excerpt (<=80 chars): type RegistryMetadataHelper struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryMetadataHelper
- GetPermissionChecks
- GetRegistryMetadata
- GetRegistryMetadataByIdentifier
- GetRegistryMetadataByParentIDAndIdentifier
- GetRegistryMetadataByParentPathAndIdentifier
- GetRegistryMetadataByPath
- GetRegistryRequestBaseInfo
- GetSecretSpaceID
- MapToAPIExtraHeaders
- MapToAPIWebhookTriggers
- MapToInternalWebhookTriggers
- MapToWebhookCore
- MapToWebhookResponseEntity
- NewRegistryMetadataHelper
```

--------------------------------------------------------------------------------

---[FILE: registry_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/registry_repository.go
Signals: N/A
Excerpt (<=80 chars): type RegistryRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryRepository
- RegistryRepository_Expecter
- RegistryRepository_Count_Call
- RegistryRepository_CountAll_Call
- RegistryRepository_Create_Call
- RegistryRepository_Delete_Call
- RegistryRepository_FetchRegistriesIDByUpstreamProxyID_Call
- RegistryRepository_FetchUpstreamProxyIDs_Call
- RegistryRepository_FetchUpstreamProxyKeys_Call
- RegistryRepository_Get_Call
- RegistryRepository_GetAll_Call
- RegistryRepository_GetByIDIn_Call
- RegistryRepository_GetByParentIDAndName_Call
- RegistryRepository_GetByRootParentIDAndName_Call
- RegistryRepository_Update_Call
- EXPECT
- Count
```

--------------------------------------------------------------------------------

---[FILE: reporter.go]---
Location: harness-main/registry/app/api/controller/mocks/reporter.go
Signals: N/A
Excerpt (<=80 chars): type Reporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- NewReporter
- Report
- ArtifactCreated
- ArtifactDeleted
```

--------------------------------------------------------------------------------

---[FILE: Service.go]---
Location: harness-main/registry/app/api/controller/mocks/Service.go
Signals: N/A
Excerpt (<=80 chars): type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Service_Expecter
- Service_Delete_Call
- Service_Get_Call
- Service_IsPublicAccessSupported_Call
- Service_Set_Call
- EXPECT
- Delete
- Run
- Return
- RunAndReturn
- Get
- IsPublicAccessSupported
```

--------------------------------------------------------------------------------

---[FILE: space_finder.go]---
Location: harness-main/registry/app/api/controller/mocks/space_finder.go
Signals: N/A
Excerpt (<=80 chars): type SpaceFinder struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpaceFinder
- Find
- FindByID
- FindByRef
- FindByPath
- FindByIdentifier
```

--------------------------------------------------------------------------------

---[FILE: space_path_store.go]---
Location: harness-main/registry/app/api/controller/mocks/space_path_store.go
Signals: N/A
Excerpt (<=80 chars): type SpacePathStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpacePathStore
- FindByPath
- FindPrimaryBySpaceID
- InsertSegment
- DeletePrimarySegment
- DeletePathsAndDescendandPaths
```

--------------------------------------------------------------------------------

---[FILE: storage_driver.go]---
Location: harness-main/registry/app/api/controller/mocks/storage_driver.go
Signals: N/A
Excerpt (<=80 chars): type StorageDriver struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StorageDriver
- Delete
- GetContent
- List
- Move
- Name
- PutContent
- Reader
- RedirectURL
- Stat
- Walk
- Writer
- NewStorageDriver
```

--------------------------------------------------------------------------------

---[FILE: stream_producer.go]---
Location: harness-main/registry/app/api/controller/mocks/stream_producer.go
Signals: N/A
Excerpt (<=80 chars): type StreamProducer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StreamProducer
- Send
- Close
```

--------------------------------------------------------------------------------

---[FILE: tag_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/tag_repository.go
Signals: N/A
Excerpt (<=80 chars): func NewMockTagRepository(t interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockTagRepository
- MockTagRepository_Expecter
- MockTagRepository_CountAllArtifactsByParentID_Call
- MockTagRepository_CountAllArtifactsByRepo_Call
- MockTagRepository_CountAllTagsByRepoAndImage_Call
- MockTagRepository_CountOciVersionByRepoAndImage_Call
- MockTagRepository_CreateOrUpdate_Call
- MockTagRepository_DeleteTag_Call
- MockTagRepository_DeleteTagByManifestID_Call
- MockTagRepository_DeleteTagByName_Call
- MockTagRepository_DeleteTagsByImageName_Call
- MockTagRepository_FindTag_Call
- MockTagRepository_GetAllArtifactsByParentID_Call
- MockTagRepository_GetAllArtifactsByParentIDUntagged_Call
- MockTagRepository_GetAllArtifactsByRepo_Call
- MockTagRepository_GetAllOciVersionsByRepoAndImage_Call
- MockTagRepository_GetAllTagsByRepoAndImage_Call
- MockTagRepository_GetLatestTag_Call
```

--------------------------------------------------------------------------------

---[FILE: transaction.go]---
Location: harness-main/registry/app/api/controller/mocks/transaction.go
Signals: N/A
Excerpt (<=80 chars): type Transaction struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Transaction
- WithTx
```

--------------------------------------------------------------------------------

---[FILE: transactor.go]---
Location: harness-main/registry/app/api/controller/mocks/transactor.go
Signals: N/A
Excerpt (<=80 chars): type Transactor struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Transactor
- WithTx
- BeginTx
- CommitTx
- RollbackTx
```

--------------------------------------------------------------------------------

---[FILE: upstream_proxy_config_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/upstream_proxy_config_repository.go
Signals: N/A
Excerpt (<=80 chars): type UpstreamProxyConfigRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpstreamProxyConfigRepository
- CountAll
- Create
- Delete
- Get
- GetAll
- GetByParentID
- GetByRegistryIdentifier
- Update
- NewUpstreamProxyConfigRepository
```

--------------------------------------------------------------------------------

---[FILE: upstream_proxy_store.go]---
Location: harness-main/registry/app/api/controller/mocks/upstream_proxy_store.go
Signals: N/A
Excerpt (<=80 chars): type UpstreamProxyStore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpstreamProxyStore
- Get
- GetByRegistryIdentifier
- GetByParentID
- Create
- Delete
- Update
- GetAll
- CountAll
```

--------------------------------------------------------------------------------

---[FILE: url_provider.go]---
Location: harness-main/registry/app/api/controller/mocks/url_provider.go
Signals: N/A
Excerpt (<=80 chars): type Provider struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Provider
- GenerateContainerGITCloneURL
- GenerateGITCloneSSHURL
- GenerateGITCloneURL
- GenerateUIBuildURL
- GenerateUICompareURL
- GenerateUIPRURL
- GenerateUIRefURL
- GenerateUIRegistryURL
- GenerateUIRepoURL
- GetAPIHostname
- GetAPIProto
- GetGITHostname
- GetInternalAPIURL
- GetUIBaseURL
- PackageURL
- RegistryURL
- NewProvider
```

--------------------------------------------------------------------------------

---[FILE: webhooks_execution_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/webhooks_execution_repository.go
Signals: N/A
Excerpt (<=80 chars): type WebhooksExecutionRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhooksExecutionRepository
- Find
- Create
- ListForWebhook
- CountForWebhook
- ListForTrigger
```

--------------------------------------------------------------------------------

---[FILE: webhooks_repository.go]---
Location: harness-main/registry/app/api/controller/mocks/webhooks_repository.go
Signals: N/A
Excerpt (<=80 chars): type WebhooksRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhooksRepository
- Create
- GetByRegistryAndIdentifier
- Find
- ListByRegistry
- ListAllByRegistry
- CountAllByRegistry
- Update
- DeleteByRegistryAndIdentifier
- UpdateOptLock
```

--------------------------------------------------------------------------------

---[FILE: webhook_service.go]---
Location: harness-main/registry/app/api/controller/mocks/webhook_service.go
Signals: N/A
Excerpt (<=80 chars): type WebhookService struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookService
- ReTriggerWebhookExecution
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: download_package.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/download_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackage
- getDownloadPackageErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: download_package_index.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/download_package_index.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackageIndex(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageIndex
- getDownloadPackageIndexErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: regenerate_package_index.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/regenerate_package_index.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) RegeneratePackageIndex(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegeneratePackageIndex
```

--------------------------------------------------------------------------------

---[FILE: registry_config.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/registry_config.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) GetRegistryConfig(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRegistryConfig
- getDownloadURL
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/response.go
Signals: N/A
Excerpt (<=80 chars):  type BaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseResponse
- GetRegistryConfigResponse
- UploadArtifactWarnings
- UploadArtifactResponse
- DownloadFileResponse
- GetPackageIndexResponse
- GetPackageResponse
- UpdateYankResponse
- RegeneratePackageIndexResponse
- SearchPackageResponse
- SearchPackageResponseCrate
- SearchPackageResponseMetadata
- GetError
```

--------------------------------------------------------------------------------

---[FILE: search_package.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/search_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) SearchPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackage
- getSearchPackageRequestInfo
- mapArtifactToSearchPackageCrate
```

--------------------------------------------------------------------------------

---[FILE: update_yank.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/update_yank.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) UpdateYank(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateYank
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/upload.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) UploadPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackage
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/cargo/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ControllerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/generic/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DBStore
- NewController
- NewDBStore
- UploadArtifact
- updateMetadata
- PullArtifact
- CheckIfFileAlreadyExist
- ParseAndUploadToTmp
- UploadFile
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/generic/response.go
Signals: N/A
Excerpt (<=80 chars):  type BaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseResponse
- HeadArtifactResponse
- GetArtifactResponse
- PutArtifactResponse
- DeleteArtifactResponse
- GetError
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/api/controller/pkg/generic/utils.go
Signals: N/A
Excerpt (<=80 chars):  func validateFileName(filename string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateFileName
```

--------------------------------------------------------------------------------

---[FILE: v2.go]---
Location: harness-main/registry/app/api/controller/pkg/generic/v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c Controller) DownloadFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadFile
- HeadFile
- DeleteFile
- PutFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/generic/wire.go
Signals: N/A
Excerpt (<=80 chars):  func DBStoreProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DBStoreProvider
- ControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/gopackage/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: download_package_file.go]---
Location: harness-main/registry/app/api/controller/pkg/gopackage/download_package_file.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
- getDownloadPackageFileErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: regenerate_pacakge_index.go]---
Location: harness-main/registry/app/api/controller/pkg/gopackage/regenerate_pacakge_index.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) RegeneratePackageIndex(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegeneratePackageIndex
- getRegeneratePackageIndexErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: regenerate_pacakge_metadata.go]---
Location: harness-main/registry/app/api/controller/pkg/gopackage/regenerate_pacakge_metadata.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) RegeneratePackageMetadata(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegeneratePackageMetadata
- getRegeneratePackageMetadataErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/gopackage/response.go
Signals: N/A
Excerpt (<=80 chars):  type BaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseResponse
- DownloadFileResponse
- UploadFileResponse
- RegeneratePackageIndexResponse
- RegeneratePackageMetadataResponse
- GetError
```

--------------------------------------------------------------------------------

---[FILE: upload_package.go]---
Location: harness-main/registry/app/api/controller/pkg/gopackage/upload_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) UploadPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackage
- getUploadPackageFileErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/gopackage/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ControllerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: commit_revision.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/commit_revision.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) CommitRevision(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommitRevision
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/controller.go
Signals: N/A
Excerpt (<=80 chars): type Controller interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: download_file.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/download_file.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadFile
```

--------------------------------------------------------------------------------

---[FILE: head_file.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/head_file.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) HeadFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadFile
```

--------------------------------------------------------------------------------

---[FILE: lfs_info.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/lfs_info.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) LfsInfo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LfsInfo
```

--------------------------------------------------------------------------------

---[FILE: lfs_upload.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/lfs_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) LfsUpload(ctx context.Context, info hftype.ArtifactInfo...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LfsUpload
```

--------------------------------------------------------------------------------

---[FILE: lfs_verify.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/lfs_verify.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) LfsVerify(ctx context.Context, info hftype.ArtifactInfo...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LfsVerify
```

--------------------------------------------------------------------------------

---[FILE: pre_upload.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/pre_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) PreUpload(ctx context.Context, info hftype.ArtifactInfo...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreUpload
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/response.go
Signals: N/A
Excerpt (<=80 chars): type BaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseResponse
- ValidateYamlResponse
- PreUploadResponse
- RevisionInfoResponse
- LfsInfoResponse
- LfsUploadResponse
- LfsVerifyResponse
- CommitRevisionResponse
- HeadFileResponse
- DownloadFileResponse
- GetError
```

--------------------------------------------------------------------------------

---[FILE: revision_info.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/revision_info.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) RevisionInfo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevisionInfo
```

--------------------------------------------------------------------------------

---[FILE: validate_yaml.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/validate_yaml.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) ValidateYaml(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateYaml
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/huggingface/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: add_tag.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/add_tag.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) AddTag(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddTag
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/controller.go
Signals: N/A
Excerpt (<=80 chars): type controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: delete_package.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/delete_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DeletePackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePackage
```

--------------------------------------------------------------------------------

---[FILE: delete_tag.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/delete_tag.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DeleteTag(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteTag
```

--------------------------------------------------------------------------------

---[FILE: delete_version.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/delete_version.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DeleteVersion(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteVersion
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/download.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: download_file.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/download_file.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackageFileByName(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFileByName
```

--------------------------------------------------------------------------------

---[FILE: head_file.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/head_file.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) HeadPackageFileByName(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadPackageFileByName
```

--------------------------------------------------------------------------------

---[FILE: list_tag.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/list_tag.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) ListTags(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListTags
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/metadata.go
Signals: N/A
Excerpt (<=80 chars): func (c *controller) GetPackageMetadata(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageMetadata
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/response.go
Signals: N/A
Excerpt (<=80 chars):  type GetMetadataResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetMetadataResponse
- ListTagResponse
- BaseResponse
- GetArtifactResponse
- PutArtifactResponse
- HeadMetadataResponse
- DeleteEntityResponse
- SearchArtifactResponse
- GetError
```

--------------------------------------------------------------------------------

---[FILE: search_package.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/search_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) SearchPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackage
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/upload.go
Signals: N/A
Excerpt (<=80 chars): func (c *controller) UploadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/npm/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ControllerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: delete_package.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/delete_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DeletePackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePackage
```

--------------------------------------------------------------------------------

---[FILE: download_package.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/download_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackage
```

--------------------------------------------------------------------------------

---[FILE: get_package_metadata.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/get_package_metadata.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) GetPackageMetadata(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageMetadata
```

--------------------------------------------------------------------------------

````
