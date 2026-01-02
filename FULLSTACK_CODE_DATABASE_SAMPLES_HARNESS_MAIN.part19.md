---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 19
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 19 of 37)

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

---[FILE: get_package_version_metadata.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/get_package_version_metadata.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) GetPackageVersionMetadata(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageVersionMetadata
```

--------------------------------------------------------------------------------

---[FILE: get_package_version_metadata_v2.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/get_package_version_metadata_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) GetPackageVersionMetadataV2(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageVersionMetadataV2
```

--------------------------------------------------------------------------------

---[FILE: list_package_version.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/list_package_version.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) ListPackageVersion(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPackageVersion
```

--------------------------------------------------------------------------------

---[FILE: list_package_version_v2.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/list_package_version_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) ListPackageVersionV2(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPackageVersionV2
```

--------------------------------------------------------------------------------

---[FILE: package_version_count_v2.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/package_version_count_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) CountPackageVersionV2(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CountPackageVersionV2
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/response.go
Signals: N/A
Excerpt (<=80 chars):  type BaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseResponse
- GetServiceEndpointResponse
- GetServiceEndpointV2Response
- GetServiceMetadataV2Response
- GetArtifactResponse
- PutArtifactResponse
- DeleteArtifactResponse
- ListPackageVersionResponse
- ListPackageVersionV2Response
- SearchPackageV2Response
- SearchPackageResponse
- EntityCountResponse
- GetPackageMetadataResponse
- GetPackageVersionMetadataV2Response
- RegistrationResponse
- GetPackageVersionMetadataResponse
- GetError
```

--------------------------------------------------------------------------------

---[FILE: search.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/search.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) SearchPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackage
- extractResponseData
```

--------------------------------------------------------------------------------

---[FILE: search_count_v2.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/search_count_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) CountPackageV2(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CountPackageV2
```

--------------------------------------------------------------------------------

---[FILE: search_v2.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/search_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) SearchPackageV2(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackageV2
- extractResponseDataV2
```

--------------------------------------------------------------------------------

---[FILE: service_endpoint.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/service_endpoint.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) GetServiceEndpoint(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetServiceEndpoint
```

--------------------------------------------------------------------------------

---[FILE: service_endpoint_v2.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/service_endpoint_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) GetServiceEndpointV2(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetServiceEndpointV2
```

--------------------------------------------------------------------------------

---[FILE: service_metadata_v2.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/service_metadata_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) GetServiceMetadataV2(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetServiceMetadataV2
```

--------------------------------------------------------------------------------

---[FILE: upload_package.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/upload_package.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) UploadPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackage
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/nuget/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ControllerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/python/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/registry/app/api/controller/pkg/python/download.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/api/controller/pkg/python/metadata.go
Signals: N/A
Excerpt (<=80 chars): func (c *controller) GetPackageMetadata(ctx context.Context, info pythontype....

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageMetadata
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/python/response.go
Signals: N/A
Excerpt (<=80 chars):  type BaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseResponse
- GetMetadataResponse
- GetArtifactResponse
- PutArtifactResponse
- GetError
```

--------------------------------------------------------------------------------

---[FILE: upload_package.go]---
Location: harness-main/registry/app/api/controller/pkg/python/upload_package.go
Signals: N/A
Excerpt (<=80 chars): func (c *controller) UploadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/python/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ControllerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/registry/app/api/controller/pkg/rpm/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/registry/app/api/controller/pkg/rpm/download.go
Signals: N/A
Excerpt (<=80 chars):  func (c *controller) DownloadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/registry/app/api/controller/pkg/rpm/metadata.go
Signals: N/A
Excerpt (<=80 chars): func (c *controller) GetRepoData(ctx context.Context, info rpmtype.ArtifactIn...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRepoData
```

--------------------------------------------------------------------------------

---[FILE: response.go]---
Location: harness-main/registry/app/api/controller/pkg/rpm/response.go
Signals: N/A
Excerpt (<=80 chars):  type BaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseResponse
- GetRepoDataResponse
- GetArtifactResponse
- PutArtifactResponse
- GetError
```

--------------------------------------------------------------------------------

---[FILE: upload_package.go]---
Location: harness-main/registry/app/api/controller/pkg/rpm/upload_package.go
Signals: N/A
Excerpt (<=80 chars): func (c *controller) UploadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/controller/pkg/rpm/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ControllerProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerProvider
```

--------------------------------------------------------------------------------

---[FILE: download_package.go]---
Location: harness-main/registry/app/api/handler/cargo/download_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackage
```

--------------------------------------------------------------------------------

---[FILE: download_package_index.go]---
Location: harness-main/registry/app/api/handler/cargo/download_package_index.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackageIndex(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageIndex
```

--------------------------------------------------------------------------------

---[FILE: download_package_index_test.go]---
Location: harness-main/registry/app/api/handler/cargo/download_package_index_test.go
Signals: N/A
Excerpt (<=80 chars): func TestDownloadPackageIndex_ServeContent(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDownloadPackageIndex_ServeContent
- TestDownloadPackageIndex_Redirect
- TestDownloadPackageIndex_ErrorFromController
- TestDownloadPackageIndex_InvalidArtifactInfo
- TestDownloadPackageIndex_ControllerReturnsNil
- TestDownloadPackageIndex_ServeContentError
```

--------------------------------------------------------------------------------

---[FILE: download_package_test.go]---
Location: harness-main/registry/app/api/handler/cargo/download_package_test.go
Signals: N/A
Excerpt (<=80 chars): type mockController struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockController
- fakePackagesHandler
- DownloadPackage
- DownloadPackageIndex
- GetRegistryConfig
- SearchPackage
- RegeneratePackageIndex
- UploadPackage
- UpdateYank
- GetRegistryCheckAccess
- GetArtifactInfo
- DownloadFile
- TrackDownloadStats
- GetPackageArtifactInfo
- CheckQuarantineStatus
- GetAuthenticator
- HandleErrors2
- HandleErrors
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/cargo/handler.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- GetPackageArtifactInfo
- handleCargoPackageAPIError
```

--------------------------------------------------------------------------------

---[FILE: handler_test.go]---
Location: harness-main/registry/app/api/handler/cargo/handler_test.go
Signals: N/A
Excerpt (<=80 chars): func isExpectedError(err error, testError error) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isExpectedError
- TestNewHandler
- TestHandler_GetPackageArtifactInfo_Success
- TestHandler_GetPackageArtifactInfo_Error
- TestHandler_HandleCargoPackageAPIError
```

--------------------------------------------------------------------------------

---[FILE: regenerate_package_index.go]---
Location: harness-main/registry/app/api/handler/cargo/regenerate_package_index.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) RegeneratePackageIndex(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegeneratePackageIndex
```

--------------------------------------------------------------------------------

---[FILE: regenerate_package_index_test.go]---
Location: harness-main/registry/app/api/handler/cargo/regenerate_package_index_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestRegeneratePackageIndex_Success(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- failingResponseWriter
- TestRegeneratePackageIndex_Success
- TestRegeneratePackageIndex_InvalidArtifactInfo
- TestRegeneratePackageIndex_ControllerError
- TestRegeneratePackageIndex_JSONEncodingError
- Write
```

--------------------------------------------------------------------------------

---[FILE: registry_config.go]---
Location: harness-main/registry/app/api/handler/cargo/registry_config.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetRegistryConfig(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRegistryConfig
```

--------------------------------------------------------------------------------

---[FILE: registry_config_test.go]---
Location: harness-main/registry/app/api/handler/cargo/registry_config_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetRegistryConfig_Success(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetRegistryConfig_Success
- TestGetRegistryConfig_InvalidArtifactInfo
- TestGetRegistryConfig_ControllerError
- TestGetRegistryConfig_JSONEncodingError
```

--------------------------------------------------------------------------------

---[FILE: search_package.go]---
Location: harness-main/registry/app/api/handler/cargo/search_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) SearchPackage(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackage
- getSearchPackageParams
```

--------------------------------------------------------------------------------

---[FILE: search_package_test.go]---
Location: harness-main/registry/app/api/handler/cargo/search_package_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestSearchPackage_Success(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestSearchPackage_Success
- TestSearchPackage_InvalidArtifactInfo
- TestSearchPackage_InvalidQueryParams
- TestSearchPackage_ControllerError
- TestSearchPackage_JSONEncodingError
- TestSearchPackage_EmptyQueryParams
```

--------------------------------------------------------------------------------

---[FILE: un_yank_version.go]---
Location: harness-main/registry/app/api/handler/cargo/un_yank_version.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UnYankVersion(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnYankVersion
```

--------------------------------------------------------------------------------

---[FILE: un_yank_version_test.go]---
Location: harness-main/registry/app/api/handler/cargo/un_yank_version_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestUnYankVersion_Success(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestUnYankVersion_Success
- TestUnYankVersion_InvalidArtifactInfo
- TestUnYankVersion_ControllerError
- TestUnYankVersion_JSONEncodingError
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/registry/app/api/handler/cargo/upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UploadPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackage
- parseDataFromPayload
```

--------------------------------------------------------------------------------

---[FILE: upload_test.go]---
Location: harness-main/registry/app/api/handler/cargo/upload_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestUploadPackage_Success(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestUploadPackage_Success
- TestUploadPackage_InvalidArtifactInfo
- TestUploadPackage_InvalidPayload
- TestUploadPackage_ControllerError
- TestUploadPackage_JSONEncodingError
- createMockCargoPayload
```

--------------------------------------------------------------------------------

---[FILE: yank_version.go]---
Location: harness-main/registry/app/api/handler/cargo/yank_version.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) YankVersion(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- YankVersion
```

--------------------------------------------------------------------------------

---[FILE: yank_version_test.go]---
Location: harness-main/registry/app/api/handler/cargo/yank_version_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestYankVersion_Success(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestYankVersion_Success
- TestYankVersion_InvalidArtifactInfo
- TestYankVersion_ControllerError
- TestYankVersion_JSONEncodingError
```

--------------------------------------------------------------------------------

---[FILE: base.go]---
Location: harness-main/registry/app/api/handler/generic/base.go
Signals: N/A
Excerpt (<=80 chars):  func NewGenericArtifactHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewGenericArtifactHandler
- GetGenericArtifactInfo
- GetGenericArtifactInfoV2
- GetPackageArtifactInfo
- ExtractPathVars
- handleErrors
- validatePackageVersionV2
- validatePackageVersion
- validateFilePath
```

--------------------------------------------------------------------------------

---[FILE: base_test.go]---
Location: harness-main/registry/app/api/handler/generic/base_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestValidateFilePath(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestValidateFilePath
- TestValidateFilePathRegexPattern
```

--------------------------------------------------------------------------------

---[FILE: delete_file_metadata.go]---
Location: harness-main/registry/app/api/handler/generic/delete_file_metadata.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) DeleteFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteFile
```

--------------------------------------------------------------------------------

---[FILE: get_file.go]---
Location: harness-main/registry/app/api/handler/generic/get_file.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) GetFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetFile
```

--------------------------------------------------------------------------------

---[FILE: head_file.go]---
Location: harness-main/registry/app/api/handler/generic/head_file.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) HeadFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadFile
```

--------------------------------------------------------------------------------

---[FILE: pull_artifact.go]---
Location: harness-main/registry/app/api/handler/generic/pull_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) PullArtifact(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullArtifact
- serveContent
```

--------------------------------------------------------------------------------

---[FILE: pull_artifact_test.go]---
Location: harness-main/registry/app/api/handler/generic/pull_artifact_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestPullArtifact_InvalidPath(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestPullArtifact_InvalidPath
- TestServeContent_NilReader
- TestServeContent_ValidFilename
- TestServeContent_EmptyFilename
```

--------------------------------------------------------------------------------

---[FILE: push_artifact.go]---
Location: harness-main/registry/app/api/handler/generic/push_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) PushArtifact(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushArtifact
```

--------------------------------------------------------------------------------

---[FILE: push_artifact_test.go]---
Location: harness-main/registry/app/api/handler/generic/push_artifact_test.go
Signals: N/A
Excerpt (<=80 chars): func createMultipartRequest(t *testing.T, filename, content string) *http.Req...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMultipartRequest
- TestCreateMultipartRequest
- TestHandler_Struct
```

--------------------------------------------------------------------------------

---[FILE: put_file.go]---
Location: harness-main/registry/app/api/handler/generic/put_file.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) PutFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PutFile
```

--------------------------------------------------------------------------------

---[FILE: download_package_file.go]---
Location: harness-main/registry/app/api/handler/gopackage/download_package_file.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackageFile(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/gopackage/handler.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- GetPackageArtifactInfo
- validatePathForDownload
- handleGoPackageAPIError
- parseDataFromPayload
```

--------------------------------------------------------------------------------

---[FILE: regenerate_package_index.go]---
Location: harness-main/registry/app/api/handler/gopackage/regenerate_package_index.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) RegeneratePackageIndex(w http.ResponseWriter, r *http.Requ...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegeneratePackageIndex
```

--------------------------------------------------------------------------------

---[FILE: regenerate_package_metadata.go]---
Location: harness-main/registry/app/api/handler/gopackage/regenerate_package_metadata.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) RegeneratePackageMetadata(w http.ResponseWriter, r *http.R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegeneratePackageMetadata
```

--------------------------------------------------------------------------------

---[FILE: upload_package.go]---
Location: harness-main/registry/app/api/handler/gopackage/upload_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UploadPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackage
```

--------------------------------------------------------------------------------

---[FILE: commit_revision.go]---
Location: harness-main/registry/app/api/handler/huggingface/commit_revision.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) CommitRevision(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommitRevision
```

--------------------------------------------------------------------------------

---[FILE: download_file.go]---
Location: harness-main/registry/app/api/handler/huggingface/download_file.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadFile
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/huggingface/handler.go
Signals: N/A
Excerpt (<=80 chars): type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- GetPackageArtifactInfo
- isValidRepoID
```

--------------------------------------------------------------------------------

---[FILE: head_file.go]---
Location: harness-main/registry/app/api/handler/huggingface/head_file.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) HeadFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadFile
```

--------------------------------------------------------------------------------

---[FILE: lfs_info.go]---
Location: harness-main/registry/app/api/handler/huggingface/lfs_info.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) LfsInfo(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LfsInfo
```

--------------------------------------------------------------------------------

---[FILE: lfs_upload.go]---
Location: harness-main/registry/app/api/handler/huggingface/lfs_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) LfsUpload(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LfsUpload
```

--------------------------------------------------------------------------------

---[FILE: lfs_verify.go]---
Location: harness-main/registry/app/api/handler/huggingface/lfs_verify.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) LfsVerify(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LfsVerify
```

--------------------------------------------------------------------------------

---[FILE: pre_upload.go]---
Location: harness-main/registry/app/api/handler/huggingface/pre_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) PreUpload(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreUpload
```

--------------------------------------------------------------------------------

---[FILE: revision_info.go]---
Location: harness-main/registry/app/api/handler/huggingface/revision_info.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) RevisionInfo(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevisionInfo
```

--------------------------------------------------------------------------------

---[FILE: validate_yaml.go]---
Location: harness-main/registry/app/api/handler/huggingface/validate_yaml.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) ValidateYAML(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidateYAML
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/handler/huggingface/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideHandler
```

--------------------------------------------------------------------------------

---[FILE: base.go]---
Location: harness-main/registry/app/api/handler/maven/base.go
Signals: N/A
Excerpt (<=80 chars):  type Handler struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- GetArtifactInfo
- ExtractPathVars
- getPathRoot
- handleErrors
- LogError
- GetPackageArtifactInfo
```

--------------------------------------------------------------------------------

---[FILE: get_artifact.go]---
Location: harness-main/registry/app/api/handler/maven/get_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) GetArtifact(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetArtifact
- serveContent
```

--------------------------------------------------------------------------------

---[FILE: head_artifact.go]---
Location: harness-main/registry/app/api/handler/maven/head_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) HeadArtifact(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadArtifact
```

--------------------------------------------------------------------------------

---[FILE: put_artifact.go]---
Location: harness-main/registry/app/api/handler/maven/put_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) PutArtifact(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReaderFile
- PutArtifact
```

--------------------------------------------------------------------------------

---[FILE: add_tag.go]---
Location: harness-main/registry/app/api/handler/npm/add_tag.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) AddPackageTag(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddPackageTag
```

--------------------------------------------------------------------------------

---[FILE: delete_package.go]---
Location: harness-main/registry/app/api/handler/npm/delete_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DeletePackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePackage
```

--------------------------------------------------------------------------------

---[FILE: delete_preview.go]---
Location: harness-main/registry/app/api/handler/npm/delete_preview.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DeletePreview(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePreview
```

--------------------------------------------------------------------------------

---[FILE: delete_tag.go]---
Location: harness-main/registry/app/api/handler/npm/delete_tag.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DeletePackageTag(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePackageTag
```

--------------------------------------------------------------------------------

---[FILE: delete_version.go]---
Location: harness-main/registry/app/api/handler/npm/delete_version.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DeleteVersion(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteVersion
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/registry/app/api/handler/npm/download.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackageFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: download_file.go]---
Location: harness-main/registry/app/api/handler/npm/download_file.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackageFileByName(w http.ResponseWriter, r *http.R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFileByName
```

--------------------------------------------------------------------------------

---[FILE: get_metadata.go]---
Location: harness-main/registry/app/api/handler/npm/get_metadata.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetPackageMetadata(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageMetadata
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/npm/handler.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- GetPackageArtifactInfo
- GetNPMFile
- isValidNameAndVersion
```

--------------------------------------------------------------------------------

---[FILE: head_file.go]---
Location: harness-main/registry/app/api/handler/npm/head_file.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) HeadPackageFileByName(w http.ResponseWriter, r *http.Reque...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadPackageFileByName
```

--------------------------------------------------------------------------------

---[FILE: list_tag.go]---
Location: harness-main/registry/app/api/handler/npm/list_tag.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) ListPackageTag(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPackageTag
```

--------------------------------------------------------------------------------

---[FILE: search.go]---
Location: harness-main/registry/app/api/handler/npm/search.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) SearchPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackage
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/registry/app/api/handler/npm/upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UploadPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackage
```

--------------------------------------------------------------------------------

---[FILE: utils.go]---
Location: harness-main/registry/app/api/handler/npm/utils.go
Signals: N/A
Excerpt (<=80 chars):  func PackageNameFromParams(r *http.Request) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageNameFromParams
- GetVersionFromParams
- VersionNameFromFileName
- GetFileName
```

--------------------------------------------------------------------------------

---[FILE: delete_package.go]---
Location: harness-main/registry/app/api/handler/nuget/delete_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DeletePackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePackage
```

--------------------------------------------------------------------------------

---[FILE: download_package.go]---
Location: harness-main/registry/app/api/handler/nuget/download_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackage
```

--------------------------------------------------------------------------------

---[FILE: download_symbol_package_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/download_symbol_package_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadSymbolPackageV2(w http.ResponseWriter, r *http.Req...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadSymbolPackageV2
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/nuget/handler.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- GetPackageArtifactInfo
```

--------------------------------------------------------------------------------

---[FILE: list_package_version.go]---
Location: harness-main/registry/app/api/handler/nuget/list_package_version.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) ListPackageVersion(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPackageVersion
```

--------------------------------------------------------------------------------

---[FILE: list_package_version_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/list_package_version_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) ListPackageVersionV2(w http.ResponseWriter, r *http.Reques...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListPackageVersionV2
```

--------------------------------------------------------------------------------

---[FILE: package_metadata.go]---
Location: harness-main/registry/app/api/handler/nuget/package_metadata.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetPackageMetadata(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageMetadata
```

--------------------------------------------------------------------------------

---[FILE: package_version_count_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/package_version_count_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetPackageVersionCountV2(w http.ResponseWriter, r *http.Re...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageVersionCountV2
```

--------------------------------------------------------------------------------

---[FILE: package_version_metadata.go]---
Location: harness-main/registry/app/api/handler/nuget/package_version_metadata.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetPackageVersionMetadata(w http.ResponseWriter, r *http.R...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageVersionMetadata
```

--------------------------------------------------------------------------------

---[FILE: package_version_metadata_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/package_version_metadata_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetPackageVersionMetadataV2(w http.ResponseWriter, r *http...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPackageVersionMetadataV2
```

--------------------------------------------------------------------------------

````
