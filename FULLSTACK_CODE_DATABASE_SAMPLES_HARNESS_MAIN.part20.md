---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 20
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 20 of 37)

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

---[FILE: search.go]---
Location: harness-main/registry/app/api/handler/nuget/search.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) SearchPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackage
```

--------------------------------------------------------------------------------

---[FILE: search_count_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/search_count_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) CountPackageV2(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CountPackageV2
```

--------------------------------------------------------------------------------

---[FILE: search_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/search_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) SearchPackageV2(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchPackageV2
```

--------------------------------------------------------------------------------

---[FILE: service_endpoint.go]---
Location: harness-main/registry/app/api/handler/nuget/service_endpoint.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetServiceEndpoint(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetServiceEndpoint
```

--------------------------------------------------------------------------------

---[FILE: service_endpoint_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/service_endpoint_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetServiceEndpointV2(w http.ResponseWriter, r *http.Reques...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetServiceEndpointV2
```

--------------------------------------------------------------------------------

---[FILE: service_metadata_v2.go]---
Location: harness-main/registry/app/api/handler/nuget/service_metadata_v2.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetServiceMetadataV2(w http.ResponseWriter, r *http.Reques...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetServiceMetadataV2
```

--------------------------------------------------------------------------------

---[FILE: upload_package.go]---
Location: harness-main/registry/app/api/handler/nuget/upload_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UploadPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackage
```

--------------------------------------------------------------------------------

---[FILE: upload_symbol_package.go]---
Location: harness-main/registry/app/api/handler/nuget/upload_symbol_package.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UploadSymbolPackage(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadSymbolPackage
```

--------------------------------------------------------------------------------

---[FILE: base.go]---
Location: harness-main/registry/app/api/handler/oci/base.go
Signals: N/A
Excerpt (<=80 chars):  func NewHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- getRouteType
- ExtractPathVars
- handleErrors
- getPathRoot
- GetRegistryInfo
```

--------------------------------------------------------------------------------

---[FILE: delete_blob.go]---
Location: harness-main/registry/app/api/handler/oci/delete_blob.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) DeleteBlob(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteBlob
```

--------------------------------------------------------------------------------

---[FILE: delete_blob_upload.go]---
Location: harness-main/registry/app/api/handler/oci/delete_blob_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) CancelBlobUpload(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CancelBlobUpload
```

--------------------------------------------------------------------------------

---[FILE: delete_manifest.go]---
Location: harness-main/registry/app/api/handler/oci/delete_manifest.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) DeleteManifest(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteManifest
```

--------------------------------------------------------------------------------

---[FILE: get_base.go]---
Location: harness-main/registry/app/api/handler/oci/get_base.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) APIBase(w http.ResponseWriter, _ *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APIBase
```

--------------------------------------------------------------------------------

---[FILE: get_blob.go]---
Location: harness-main/registry/app/api/handler/oci/get_blob.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) GetBlob(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetBlob
- serveContent
```

--------------------------------------------------------------------------------

---[FILE: get_blob_upload.go]---
Location: harness-main/registry/app/api/handler/oci/get_blob_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) GetUploadBlobStatus(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetUploadBlobStatus
```

--------------------------------------------------------------------------------

---[FILE: get_catalog.go]---
Location: harness-main/registry/app/api/handler/oci/get_catalog.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) GetCatalog(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetCatalog
```

--------------------------------------------------------------------------------

---[FILE: get_manifest.go]---
Location: harness-main/registry/app/api/handler/oci/get_manifest.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) GetManifest(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetManifest
```

--------------------------------------------------------------------------------

---[FILE: get_referrers.go]---
Location: harness-main/registry/app/api/handler/oci/get_referrers.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) GetReferrers(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetReferrers
```

--------------------------------------------------------------------------------

---[FILE: get_tags.go]---
Location: harness-main/registry/app/api/handler/oci/get_tags.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) GetTags(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetTags
```

--------------------------------------------------------------------------------

---[FILE: get_token.go]---
Location: harness-main/registry/app/api/handler/oci/get_token.go
Signals: N/A
Excerpt (<=80 chars):  type TokenResponseOCI struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TokenResponseOCI
- ResourceActions
- GetToken
- getSpace
- getAccessPermissionList
- getPermissionFromAction
- returnForbiddenResponse
- getTokenDetails
- GetRequestedResourceActions
- getScopes
```

--------------------------------------------------------------------------------

---[FILE: head_blob.go]---
Location: harness-main/registry/app/api/handler/oci/head_blob.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) HeadBlob(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadBlob
```

--------------------------------------------------------------------------------

---[FILE: head_manifest.go]---
Location: harness-main/registry/app/api/handler/oci/head_manifest.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) HeadManifest(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeadManifest
```

--------------------------------------------------------------------------------

---[FILE: patch_blob_upload.go]---
Location: harness-main/registry/app/api/handler/oci/patch_blob_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) PatchBlobUpload(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PatchBlobUpload
```

--------------------------------------------------------------------------------

---[FILE: post_blob_upload.go]---
Location: harness-main/registry/app/api/handler/oci/post_blob_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) InitiateUploadBlob(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InitiateUploadBlob
```

--------------------------------------------------------------------------------

---[FILE: put_blob_upload.go]---
Location: harness-main/registry/app/api/handler/oci/put_blob_upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *Handler) CompleteBlobUpload(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CompleteBlobUpload
```

--------------------------------------------------------------------------------

---[FILE: put_manifest.go]---
Location: harness-main/registry/app/api/handler/oci/put_manifest.go
Signals: N/A
Excerpt (<=80 chars): func (h *Handler) PutManifest(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PutManifest
```

--------------------------------------------------------------------------------

---[FILE: download_file.go]---
Location: harness-main/registry/app/api/handler/packages/download_file.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadFile
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/packages/handler.go
Signals: N/A
Excerpt (<=80 chars):  func NewHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handler
- NewHandler
- GetAuthenticator
- GetRegistryCheckAccess
- TrackDownloadStats
- CheckQuarantineStatus
- GetArtifactInfo
- GetUtilityMethodArtifactInfo
- HandleErrors2
- HandleErrors
- HandleError
- LogError
- extractPathVars
- ServeContent
- GetPackageArtifactInfo
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/registry/app/api/handler/python/download.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackageFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/python/handler.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewHandler
- GetPackageArtifactInfo
- getHomePage
- isValidNameAndVersion
- normalizeLabel
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/registry/app/api/handler/python/list.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) PackageMetadata(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageMetadata
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/registry/app/api/handler/python/upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UploadPackageFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/registry/app/api/handler/rpm/download.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) DownloadPackageFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DownloadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/api/handler/rpm/handler.go
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

---[FILE: repodata.go]---
Location: harness-main/registry/app/api/handler/rpm/repodata.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) GetRepoData(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRepoData
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/registry/app/api/handler/rpm/upload.go
Signals: N/A
Excerpt (<=80 chars):  func (h *handler) UploadPackageFile(w http.ResponseWriter, r *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UploadPackageFile
```

--------------------------------------------------------------------------------

---[FILE: swagger.go]---
Location: harness-main/registry/app/api/handler/swagger/swagger.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- GetSwaggerHandler
```

--------------------------------------------------------------------------------

---[FILE: artifactfilter.go]---
Location: harness-main/registry/app/api/handler/utils/artifactfilter.go
Signals: N/A
Excerpt (<=80 chars):  func PatternAllowed(allowedPattern pq.StringArray, blockedPattern pq.StringA...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PatternAllowed
- matchPatterns
```

--------------------------------------------------------------------------------

---[FILE: jsonform.go]---
Location: harness-main/registry/app/api/handler/utils/jsonform.go
Signals: N/A
Excerpt (<=80 chars): func FillFromForm(r *http.Request, data any) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FillFromForm
```

--------------------------------------------------------------------------------

---[FILE: request.go]---
Location: harness-main/registry/app/api/handler/utils/request.go
Signals: N/A
Excerpt (<=80 chars):  func GetFileReader(r *http.Request, formKey string) (*multipart.Part, string...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetFileReader
```

--------------------------------------------------------------------------------

---[FILE: package_type_factory.go]---
Location: harness-main/registry/app/api/interfaces/package_type_factory.go
Signals: N/A
Excerpt (<=80 chars):  type PackageHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageHelper
```

--------------------------------------------------------------------------------

---[FILE: package_wrapper.go]---
Location: harness-main/registry/app/api/interfaces/package_wrapper.go
Signals: N/A
Excerpt (<=80 chars):  type PackageWrapper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageWrapper
```

--------------------------------------------------------------------------------

---[FILE: registry_helper.go]---
Location: harness-main/registry/app/api/interfaces/registry_helper.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryHelper
```

--------------------------------------------------------------------------------

---[FILE: registry_metadata.go]---
Location: harness-main/registry/app/api/interfaces/registry_metadata.go
Signals: N/A
Excerpt (<=80 chars): type RegistryMetadataHelper interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryMetadataHelper
```

--------------------------------------------------------------------------------

---[FILE: space_finder.go]---
Location: harness-main/registry/app/api/interfaces/space_finder.go
Signals: N/A
Excerpt (<=80 chars): type SpaceFinder interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpaceFinder
```

--------------------------------------------------------------------------------

---[FILE: artifact_info.go]---
Location: harness-main/registry/app/api/middleware/artifact_info.go
Signals: N/A
Excerpt (<=80 chars): func StoreArtifactInfo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StoreArtifactInfo
```

--------------------------------------------------------------------------------

---[FILE: auth.go]---
Location: harness-main/registry/app/api/middleware/auth.go
Signals: N/A
Excerpt (<=80 chars):  func OciCheckAuth(h *oci.Handler) func(http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OciCheckAuth
- BlockNonOciSourceToken
- CheckSig
- CheckAuthWithChallenge
- CheckAuthHeader
- CheckNugetAPIKey
- setNugetAuthChallenge
- setAuthenticateHeader
- getRefsFromName
- getScope
- returnUnauthorised
```

--------------------------------------------------------------------------------

---[FILE: bandwidth_stats.go]---
Location: harness-main/registry/app/api/middleware/bandwidth_stats.go
Signals: N/A
Excerpt (<=80 chars):  type StatusWriter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StatusWriter
- WriteHeader
- Write
- TrackBandwidthStat
- TrackBandwidthStatForGenericArtifacts
- TrackBandwidthStatForMavenArtifacts
- dbBandwidthStatForGenericArtifact
- dbBandwidthStatForMavenArtifact
- dbBandwidthStat
- getImageFromUpstreamProxy
- getMavenArtifactFromUpstreamProxy
```

--------------------------------------------------------------------------------

---[FILE: download_stats.go]---
Location: harness-main/registry/app/api/middleware/download_stats.go
Signals: N/A
Excerpt (<=80 chars):  func TrackDownloadStat(h *oci.Handler) func(http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TrackDownloadStat
- dbDownloadStat
- TrackDownloadStatForGenericArtifact
- TrackDownloadStatForMavenArtifact
- dbDownloadStatForGenericArtifact
- dbDownloadStatForMavenArtifact
- TrackDownloadStatsForGoPackage
- TrackDownloadStats
```

--------------------------------------------------------------------------------

---[FILE: original_url.go]---
Location: harness-main/registry/app/api/middleware/original_url.go
Signals: N/A
Excerpt (<=80 chars): func StoreOriginalPath(next http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StoreOriginalPath
```

--------------------------------------------------------------------------------

---[FILE: quarantine_artifact.go]---
Location: harness-main/registry/app/api/middleware/quarantine_artifact.go
Signals: N/A
Excerpt (<=80 chars):  func CheckQuarantineStatus(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckQuarantineStatus
- CheckQuarantineStatusOCI
- dbQuarantineStatusOCI
```

--------------------------------------------------------------------------------

---[FILE: request_package_access.go]---
Location: harness-main/registry/app/api/middleware/request_package_access.go
Signals: N/A
Excerpt (<=80 chars):  func RequestPackageAccess(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestPackageAccess
- RequestNugetPackageAccess
```

--------------------------------------------------------------------------------

---[FILE: services.gen.go]---
Location: harness-main/registry/app/api/openapi/contracts/artifact/services.gen.go
Signals: N/A
Excerpt (<=80 chars): type ServerInterface interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServerInterface
- Unimplemented
- ServerInterfaceWrapper
- UnescapedCookieParamError
- UnmarshalingParamError
- RequiredParamError
- RequiredHeaderError
- InvalidParamFormatError
- TooManyValuesForParamError
- ChiServerOptions
- ArtifactDetailResponseJSONResponse
- ArtifactFileResponseJSONResponse
- ArtifactLabelResponseJSONResponse
- ArtifactStatsResponseJSONResponse
- ArtifactSummaryResponseJSONResponse
- ArtifactVersionSummaryResponseJSONResponse
- ClientSetupDetailsResponseJSONResponse
- DockerArtifactDetailResponseJSONResponse
```

--------------------------------------------------------------------------------

---[FILE: types.gen.go]---
Location: harness-main/registry/app/api/openapi/contracts/artifact/types.gen.go
Signals: N/A
Excerpt (<=80 chars): type AccessKeySecretKey struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AccessKeySecretKey
- Anonymous
- ArtifactDetail
- ArtifactLabelRequest
- ArtifactMetadata
- ArtifactStats
- ArtifactSummary
- ArtifactVersionMetadata
- ArtifactVersionSummary
- CargoArtifactDetailConfig
- CleanupPolicy
- ClientSetupDetails
- ClientSetupSection
- ClientSetupStep
- ClientSetupStepCommand
- ClientSetupStepConfig
- DockerArtifactDetail
- DockerArtifactDetailConfig
```

--------------------------------------------------------------------------------

---[FILE: registry_router.go]---
Location: harness-main/registry/app/api/router/registry_router.go
Signals: N/A
Excerpt (<=80 chars):  type RegistryRouter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryRouter
- NewRegistryRouter
- Handle
- IsEligibleTraffic
- Name
```

--------------------------------------------------------------------------------

---[FILE: router.go]---
Location: harness-main/registry/app/api/router/router.go
Signals: N/A
Excerpt (<=80 chars):  type AppRouter interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppRouter
- GetAppRouter
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/registry/app/api/router/wire.go
Signals: N/A
Excerpt (<=80 chars):  func AppRouterProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppRouterProvider
- APIHandlerProvider
- OCIHandlerProvider
- MavenHandlerProvider
- GenericHandlerProvider
- PackageHandlerProvider
```

--------------------------------------------------------------------------------

---[FILE: route.go]---
Location: harness-main/registry/app/api/router/generic/route.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewGenericArtifactHandler
```

--------------------------------------------------------------------------------

---[FILE: route.go]---
Location: harness-main/registry/app/api/router/harness/route.go
Signals: N/A
Excerpt (<=80 chars):  type APIHandler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APIHandler
- NewAPIHandler
```

--------------------------------------------------------------------------------

---[FILE: route.go]---
Location: harness-main/registry/app/api/router/maven/route.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewMavenHandler
```

--------------------------------------------------------------------------------

---[FILE: route.go]---
Location: harness-main/registry/app/api/router/oci/route.go
Signals: N/A
Excerpt (<=80 chars):  type HandlerBlock struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlerBlock
- RegistryOCIHandler
- NewHandlerBlock2
- NewOCIHandler
```

--------------------------------------------------------------------------------

---[FILE: route.go]---
Location: harness-main/registry/app/api/router/packages/route.go
Signals: N/A
Excerpt (<=80 chars):  type Handler interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- NewRouter
- registerDistTagRoutes
- registerRevisionRoutes
```

--------------------------------------------------------------------------------

---[FILE: route_utils.go]---
Location: harness-main/registry/app/api/router/utils/route_utils.go
Signals: N/A
Excerpt (<=80 chars):  type RouteType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRouteTypeV2
```

--------------------------------------------------------------------------------

---[FILE: path_utils.go]---
Location: harness-main/registry/app/api/utils/path_utils.go
Signals: N/A
Excerpt (<=80 chars):  func GetMavenFilePath(imageName string, version string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetMavenFilePath
- GetGenericFilePath
- GetRpmFilePath
- GetCargoFilePath
- GetGoFilePath
- GetHuggingFaceFilePath
- GetFilePath
- GetFilePathWithArtifactType
```

--------------------------------------------------------------------------------

---[FILE: auth.go]---
Location: harness-main/registry/app/auth/auth.go
Signals: N/A
Excerpt (<=80 chars): type AccessSet map[Resource]ActionSet

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resource
- Access
- ActionSet
- NewAccessSet
- Contains
- ScopeParam
- AppendAccess
- NewActionSet
- newStringSet
- Add
- keys
```

--------------------------------------------------------------------------------

---[FILE: url_utils.go]---
Location: harness-main/registry/app/common/url_utils.go
Signals: N/A
Excerpt (<=80 chars):  func GenerateOciTokenURL(registryURL string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateOciTokenURL
- GenerateSetupClientHostnameAndRegistry
- GetHost
- GetHostName
- TrimURLScheme
- ExtractFirstQueryParams
```

--------------------------------------------------------------------------------

---[FILE: tls.go]---
Location: harness-main/registry/app/common/http/tls.go
Signals: N/A
Excerpt (<=80 chars): func InternalTLSEnabled() bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InternalTLSEnabled
- InternalEnableVerifyClientCert
- GetInternalCertPair
- GetInternalTLSConfig
- NewServerTLSConfig
```

--------------------------------------------------------------------------------

---[FILE: transport.go]---
Location: harness-main/registry/app/common/http/transport.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TransportConfig
- init
- newDefaultTransport
- WithInternalTLSConfig
- WithInsecureSkipVerify
- WithMaxIdleConns
- WithIdleconnectionTimeout
- NewTransport
- WithInsecure
- GetHTTPTransport
```

--------------------------------------------------------------------------------

---[FILE: transport_test.go]---
Location: harness-main/registry/app/common/http/transport_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetHTTPTransport(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGetHTTPTransport
```

--------------------------------------------------------------------------------

---[FILE: modifier.go]---
Location: harness-main/registry/app/common/http/modifier/modifier.go
Signals: N/A
Excerpt (<=80 chars): type Modifier interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Modifier
```

--------------------------------------------------------------------------------

---[FILE: link.go]---
Location: harness-main/registry/app/common/lib/link.go
Signals: N/A
Excerpt (<=80 chars): type Link struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Link
- String
- ParseLinks
```

--------------------------------------------------------------------------------

---[FILE: const.go]---
Location: harness-main/registry/app/common/lib/errors/const.go
Signals: N/A
Excerpt (<=80 chars): func NotFoundError(err error) *Error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NotFoundError
- UnknownError
- IsNotFoundErr
- IsRateLimitError
```

--------------------------------------------------------------------------------

---[FILE: errors.go]---
Location: harness-main/registry/app/common/lib/errors/errors.go
Signals: N/A
Excerpt (<=80 chars): type Error struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Error
- StackTrace
- MarshalJSON
- WithMessage
- WithCode
- WithCause
- Unwrap
- Len
- NewErrs
- New
- Wrap
- Wrapf
- Errorf
- IsErr
- ErrCode
```

--------------------------------------------------------------------------------

---[FILE: stack.go]---
Location: harness-main/registry/app/common/lib/errors/stack.go
Signals: N/A
Excerpt (<=80 chars):  type stack []uintptr

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- frames
- newStack
- format
```

--------------------------------------------------------------------------------

---[FILE: stack_test.go]---
Location: harness-main/registry/app/common/lib/errors/stack_test.go
Signals: N/A
Excerpt (<=80 chars):  type stackTestSuite struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stackTestSuite
- SetupTest
- TestFrame
- TestFormat
- TestStackTestSuite
```

--------------------------------------------------------------------------------

---[FILE: addr.go]---
Location: harness-main/registry/app/dist_temp/challenge/addr.go
Signals: N/A
Excerpt (<=80 chars): func hasPort(s string) bool { return strings.LastIndex(s, ":") > strings.Last...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasPort
- canonicalAddr
```

--------------------------------------------------------------------------------

---[FILE: authchallenge.go]---
Location: harness-main/registry/app/dist_temp/challenge/authchallenge.go
Signals: N/A
Excerpt (<=80 chars): type octetType byte

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Challenge
- Manager
- simpleManager
- init
- NewSimpleManager
- normalizeURL
- GetChallenges
- AddResponse
- ResponseChallenges
- parseAuthHeader
- parseValueAndParams
- skipSpace
- expectToken
- expectTokenOrQuoted
```

--------------------------------------------------------------------------------

---[FILE: authchallenge_test.go]---
Location: harness-main/registry/app/dist_temp/challenge/authchallenge_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestAuthChallengeParse(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestAuthChallengeParse
- TestAuthChallengeNormalization
- testAuthChallengeConcurrent
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/registry/app/dist_temp/dcontext/context.go
Signals: N/A
Excerpt (<=80 chars): type instanceContext struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- instanceContext
- stringMapContext
- Value
- Background
- WithValues
```

--------------------------------------------------------------------------------

---[FILE: http.go]---
Location: harness-main/registry/app/dist_temp/dcontext/http.go
Signals: N/A
Excerpt (<=80 chars): func WithRequest(ctx context.Context, r *http.Request) context.Context {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- httpRequestContext
- muxVarsContext
- instrumentedResponseWriter
- WithRequest
- GetRequestID
- WithResponseWriter
- GetResponseWriter
- WithVars
- GetResponseLogger
- Value
- Write
- WriteHeader
- Flush
```

--------------------------------------------------------------------------------

---[FILE: http_test.go]---
Location: harness-main/registry/app/dist_temp/dcontext/http_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestWithRequest(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- testResponseWriter
- TestWithRequest
- Header
- Write
- WriteHeader
- Flush
- TestWithResponseWriter
- TestWithVars
```

--------------------------------------------------------------------------------

---[FILE: logger.go]---
Location: harness-main/registry/app/dist_temp/dcontext/logger.go
Signals: N/A
Excerpt (<=80 chars): type Logger interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Logger
- loggerKey
- WithLogger
- GetLoggerWithFields
- GetLogger
- getZerologLogger
```

--------------------------------------------------------------------------------

---[FILE: trace.go]---
Location: harness-main/registry/app/dist_temp/dcontext/trace.go
Signals: N/A
Excerpt (<=80 chars): func WithTrace(ctx context.Context) (context.Context, func(format string, a ....

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- traced
- WithTrace
- Value
```

--------------------------------------------------------------------------------

---[FILE: trace_test.go]---
Location: harness-main/registry/app/dist_temp/dcontext/trace_test.go
Signals: N/A
Excerpt (<=80 chars): func TestWithTrace(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- valueTestCase
- TestWithTrace
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/registry/app/dist_temp/dcontext/util.go
Signals: N/A
Excerpt (<=80 chars): func Since(ctx context.Context, key any) time.Duration {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Since
- GetStringValue
```

--------------------------------------------------------------------------------

---[FILE: version.go]---
Location: harness-main/registry/app/dist_temp/dcontext/version.go
Signals: N/A
Excerpt (<=80 chars):  type versionKey struct{}

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- versionKey
- String
- WithVersion
- GetVersion
```

--------------------------------------------------------------------------------

---[FILE: version_test.go]---
Location: harness-main/registry/app/dist_temp/dcontext/version_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestVersionContext(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestVersionContext
```

--------------------------------------------------------------------------------

---[FILE: errors.go]---
Location: harness-main/registry/app/dist_temp/errcode/errors.go
Signals: N/A
Excerpt (<=80 chars): type ErrorCoder interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorCoder
- Error
- ErrorDescriptor
- ErrorCode
- Descriptor
- String
- Message
- MarshalText
- UnmarshalText
- WithMessage
- WithDetail
- WithArgs
- ParseErrorCode
```

--------------------------------------------------------------------------------

---[FILE: handler.go]---
Location: harness-main/registry/app/dist_temp/errcode/handler.go
Signals: N/A
Excerpt (<=80 chars): func ServeJSON(w http.ResponseWriter, err error) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServeJSON
```

--------------------------------------------------------------------------------

---[FILE: register.go]---
Location: harness-main/registry/app/dist_temp/errcode/register.go
Signals: N/A
Excerpt (<=80 chars): func Register(group string, descriptor ErrorDescriptor) CodeError {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Register
- Len
- Swap
- Less
- GetGroupNames
- GetErrorCodeGroup
- GetErrorAllDescriptors
- FromUnknownError
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/registry/app/dist_temp/requestutil/util.go
Signals: N/A
Excerpt (<=80 chars):  func parseIP(ipStr string) net.IP {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseIP
- RemoteAddr
- RemoteIP
```

--------------------------------------------------------------------------------

---[FILE: util_test.go]---
Location: harness-main/registry/app/dist_temp/requestutil/util_test.go
Signals: N/A
Excerpt (<=80 chars): func TestRemoteAddr(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRemoteAddr
```

--------------------------------------------------------------------------------

---[FILE: fileinfo.go]---
Location: harness-main/registry/app/driver/fileinfo.go
Signals: N/A
Excerpt (<=80 chars): type FileInfo interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileInfo
- FileInfoFields
- FileInfoInternal
- Path
- Size
- ModTime
- IsDir
```

--------------------------------------------------------------------------------

---[FILE: storagedriver.go]---
Location: harness-main/registry/app/driver/storagedriver.go
Signals: N/A
Excerpt (<=80 chars): type Version string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WalkOptions
- StorageDriver
- StorageDeleter
- FileWriter
- UnsupportedMethodError
- PathNotFoundError
- InvalidPathError
- InvalidOffsetError
- Error
- StorageDriverError
- Major
- Minor
- WithStartAfterHint
```

--------------------------------------------------------------------------------

---[FILE: walk.go]---
Location: harness-main/registry/app/driver/walk.go
Signals: N/A
Excerpt (<=80 chars): type WalkFn func(fileInfo FileInfo) error

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WalkFallback
- doWalkFallback
```

--------------------------------------------------------------------------------

---[FILE: base.go]---
Location: harness-main/registry/app/driver/base/base.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Base
- init
- setDriverName
- GetContent
- PutContent
- Reader
- Writer
- Stat
- List
- Move
- Delete
- RedirectURL
- Walk
```

--------------------------------------------------------------------------------

---[FILE: regulator.go]---
Location: harness-main/registry/app/driver/base/regulator.go
Signals: N/A
Excerpt (<=80 chars):  type regulator struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- regulator
- GetLimitFromParameter
- NewRegulator
- enter
- exit
- Name
- GetContent
- PutContent
- Reader
- Writer
- Stat
- List
- Move
- Delete
- RedirectURL
```

--------------------------------------------------------------------------------

---[FILE: regulator_test.go]---
Location: harness-main/registry/app/driver/base/regulator_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestRegulatorEnterExit(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRegulatorEnterExit
- TestGetLimitFromParameter
```

--------------------------------------------------------------------------------

````
