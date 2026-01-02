---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 7
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 7 of 37)

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

---[FILE: render_error.go]---
Location: harness-main/app/api/render/render_error.go
Signals: N/A
Excerpt (<=80 chars): func TranslatedUserError(ctx context.Context, w http.ResponseWriter, err erro...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TranslatedUserError
- NotFound
- Unauthorized
- Forbidden
- Forbiddenf
- BadRequest
- BadRequestf
- InternalError
- InternalErrorf
- UserError
```

--------------------------------------------------------------------------------

---[FILE: render_test.go]---
Location: harness-main/app/api/render/render_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestWriteErrorf(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mock
- TestWriteErrorf
- TestWriteErrorCode
- TestWriteNotFound
- TestWriteUnauthorized
- TestWriteForbidden
- TestWriteBadRequest
- TestWriteJSON
- TestJSONArrayDynamic
```

--------------------------------------------------------------------------------

---[FILE: sse.go]---
Location: harness-main/app/api/render/sse.go
Signals: N/A
Excerpt (<=80 chars):  func StreamSSE(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sseStream
- StreamSSE
- event
- close
- ping
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/app/api/render/util.go
Signals: N/A
Excerpt (<=80 chars): func pagelen(size, total int) int {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pagelen
```

--------------------------------------------------------------------------------

---[FILE: util_test.go]---
Location: harness-main/app/api/render/util_test.go
Signals: N/A
Excerpt (<=80 chars):  func Test_pagelen(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Test_pagelen
```

--------------------------------------------------------------------------------

---[FILE: render.go]---
Location: harness-main/app/api/render/platform/render.go
Signals: N/A
Excerpt (<=80 chars): func RenderResource(w http.ResponseWriter, code int, v any) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- wrapper
- RenderResource
```

--------------------------------------------------------------------------------

---[FILE: archive.go]---
Location: harness-main/app/api/request/archive.go
Signals: N/A
Excerpt (<=80 chars):  func Ext(path string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ext
- ParseArchiveParams
```

--------------------------------------------------------------------------------

---[FILE: archive_test.go]---
Location: harness-main/app/api/request/archive_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseArchiveParams(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- args
- TestParseArchiveParams
- TestExt
```

--------------------------------------------------------------------------------

---[FILE: auth.go]---
Location: harness-main/app/api/request/auth.go
Signals: N/A
Excerpt (<=80 chars):  func GetAccessTokenFromQuery(r *http.Request) (string, bool) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetAccessTokenFromQuery
- GetIncludeCookieFromQueryOrDefault
- GetTokenFromCookie
```

--------------------------------------------------------------------------------

---[FILE: check.go]---
Location: harness-main/app/api/request/check.go
Signals: N/A
Excerpt (<=80 chars): func ParseCheckListOptions(r *http.Request) types.CheckListOptions {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseCheckListOptions
- ParseCheckRecentOptions
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/app/api/request/common.go
Signals: N/A
Excerpt (<=80 chars): func GetOptionalRemainderFromPath(r *http.Request) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetOptionalRemainderFromPath
- GetRemainderFromPath
- ParseQuery
- ParsePage
- ParseLimit
- ParseLimitOrDefaultWithMax
- ParseOrder
- ParseSort
- ParsePaginationFromRequest
- ParseListQueryFilterFromRequest
- ParseCreated
- ParseUpdated
- ParseEdited
- GetContentEncodingFromHeadersOrDefault
- ParseRecursiveFromQuery
- ParseInheritedFromQuery
- ParseIncludePullreqCountFromQuery
- ParseIncludeValuesFromQuery
```

--------------------------------------------------------------------------------

---[FILE: connector.go]---
Location: harness-main/app/api/request/connector.go
Signals: N/A
Excerpt (<=80 chars):  func GetConnectorRefFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetConnectorRefFromPath
```

--------------------------------------------------------------------------------

---[FILE: context.go]---
Location: harness-main/app/api/request/context.go
Signals: N/A
Excerpt (<=80 chars):  type key int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WithAuthSession
- AuthSessionFrom
- PrincipalFrom
- WithUser
- UserFrom
- WithServiceAccount
- ServiceAccountFrom
- WithSpace
- SpaceFrom
- WithRepo
- RepoFrom
- WithRequestID
- RequestIDFrom
- WithRequestIDSSH
```

--------------------------------------------------------------------------------

---[FILE: context_test.go]---
Location: harness-main/app/api/request/context_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestContext(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestContext
```

--------------------------------------------------------------------------------

---[FILE: execution.go]---
Location: harness-main/app/api/request/execution.go
Signals: N/A
Excerpt (<=80 chars): func ParseSortExecution(r *http.Request) enum.ExecutionSort {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseSortExecution
- ParseListExecutionsFilterFromRequest
```

--------------------------------------------------------------------------------

---[FILE: favorite.go]---
Location: harness-main/app/api/request/favorite.go
Signals: N/A
Excerpt (<=80 chars): func GetResourceIDFromPath(r *http.Request) (int64, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetResourceIDFromPath
- ParseResourceType
```

--------------------------------------------------------------------------------

---[FILE: git.go]---
Location: harness-main/app/api/request/git.go
Signals: N/A
Excerpt (<=80 chars):  func GetGitRefFromQueryOrDefault(r *http.Request, deflt string) string {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetGitRefFromQueryOrDefault
- GetIncludeCommitFromQueryOrDefault
- GetIncludeStatsFromQueryOrDefault
- GetIncludeGitStatsFromQueryOrDefault
- GetIncludeChecksFromQueryOrDefault
- GetIncludeRulesFromQueryOrDefault
- GetIncludePullReqsFromQueryOrDefault
- GetMaxDivergenceFromQueryOrDefault
- GetIncludeDirectoriesFromQueryOrDefault
- GetFlattenDirectoriesFromQueryOrDefault
- GetCommitSHAFromPath
- ParseSortBranch
- ParseBranchMetadataOptions
- ParseBranchFilter
- ParseSortTag
- ParseTagFilter
- ParseCommitFilter
- GetGitProtocolFromHeadersOrDefault
```

--------------------------------------------------------------------------------

---[FILE: gitspace.go]---
Location: harness-main/app/api/request/gitspace.go
Signals: N/A
Excerpt (<=80 chars):  func GetGitspaceRefFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetGitspaceRefFromPath
- ParseGitspaceSort
- ParseGitspaceOwner
- ParseGitspaceStates
- ParseScopeFilter
- ParseGitspaceFilter
```

--------------------------------------------------------------------------------

---[FILE: git_test.go]---
Location: harness-main/app/api/request/git_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGetFileDiffRequestsFromQuery(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- args
- TestGetFileDiffRequestsFromQuery
```

--------------------------------------------------------------------------------

---[FILE: infra_provider.go]---
Location: harness-main/app/api/request/infra_provider.go
Signals: N/A
Excerpt (<=80 chars):  func GetInfraProviderRefFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetInfraProviderRefFromPath
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/app/api/request/label.go
Signals: N/A
Excerpt (<=80 chars):  func GetLabelKeyFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetLabelKeyFromPath
- GetLabelValueFromPath
- GetLabelIDFromPath
- ParseLabelFilter
- ParseAssignableLabelFilter
```

--------------------------------------------------------------------------------

---[FILE: lfs.go]---
Location: harness-main/app/api/request/lfs.go
Signals: N/A
Excerpt (<=80 chars):  func GetObjectIDFromQuery(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetObjectIDFromQuery
- GetObjectSizeFromQuery
```

--------------------------------------------------------------------------------

---[FILE: membership.go]---
Location: harness-main/app/api/request/membership.go
Signals: N/A
Excerpt (<=80 chars): func ParseMembershipUserSort(r *http.Request) enum.MembershipUserSort {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseMembershipUserSort
- ParseMembershipUserFilter
- ParseMembershipSpaceSort
- ParseMembershipSpaceFilter
```

--------------------------------------------------------------------------------

---[FILE: pipeline.go]---
Location: harness-main/app/api/request/pipeline.go
Signals: N/A
Excerpt (<=80 chars):  func GetPipelineIdentifierFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPipelineIdentifierFromPath
- GetBranchFromQuery
- GetExecutionNumberFromPath
- GetStageNumberFromPath
- GetStepNumberFromPath
- GetLatestFromPath
- GetTriggerIdentifierFromPath
- ParseListPipelinesFilterFromRequest
```

--------------------------------------------------------------------------------

---[FILE: principal.go]---
Location: harness-main/app/api/request/principal.go
Signals: N/A
Excerpt (<=80 chars): func GetUserIDFromPath(r *http.Request) (int64, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetUserIDFromPath
- GetPrincipalIDFromPath
- GetPrincipalUIDFromPath
- GetUserUIDFromPath
- GetServiceAccountUIDFromPath
- ParseSortUser
- ParseUserFilter
- ParsePrincipalTypes
- ParsePrincipalFilter
```

--------------------------------------------------------------------------------

---[FILE: publickey.go]---
Location: harness-main/app/api/request/publickey.go
Signals: N/A
Excerpt (<=80 chars):  func GetPublicKeyIdentifierFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPublicKeyIdentifierFromPath
- ParsePublicKeyScheme
- ParsePublicKeyUsage
- ParseListPublicKeyQueryFilterFromRequest
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/app/api/request/pullreq.go
Signals: N/A
Excerpt (<=80 chars):  func GetPullReqNumberFromPath(r *http.Request) (int64, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetPullReqNumberFromPath
- GetReviewerIDFromPath
- GetUserGroupIDFromPath
- GetPullReqCommentIDPath
- GetPullReqSourceBranchFromPath
- GetPullReqTargetBranchFromPath
- GetSourceRepoRefFromQueryOrDefault
- ParseSortPullReq
- parsePullReqStates
- parseReviewDecisions
- ParsePullReqMetadataOptions
- ParsePullReqFilter
- ParsePullReqActivityFilter
- parsePullReqActivityKinds
- parsePullReqActivityTypes
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/app/api/request/repo.go
Signals: N/A
Excerpt (<=80 chars):  func GetRepoRefFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetRepoRefFromPath
- ParseSortRepo
- ParseOnlyFavoritesFromQuery
- ParseTagsFromQuery
- ParseRepoFilter
```

--------------------------------------------------------------------------------

---[FILE: repo_test.go]---
Location: harness-main/app/api/request/repo_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseTagsFromQuery(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestParseTagsFromQuery
```

--------------------------------------------------------------------------------

---[FILE: rule.go]---
Location: harness-main/app/api/request/rule.go
Signals: N/A
Excerpt (<=80 chars): func ParseRuleFilter(r *http.Request) *types.RuleFilter {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseRuleFilter
- parseRuleStates
- parseRuleTypes
- GetRuleIdentifierFromPath
- parseRuleSort
- ParseBypassRulesFromQuery
- ParseDryRunRulesFromQuery
```

--------------------------------------------------------------------------------

---[FILE: secret.go]---
Location: harness-main/app/api/request/secret.go
Signals: N/A
Excerpt (<=80 chars):  func GetSecretRefFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetSecretRefFromPath
```

--------------------------------------------------------------------------------

---[FILE: space.go]---
Location: harness-main/app/api/request/space.go
Signals: N/A
Excerpt (<=80 chars):  func GetSpaceRefFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetSpaceRefFromPath
- ParseSortSpace
- ParseSpaceFilter
- GetIncludeSubspacesFromQuery
```

--------------------------------------------------------------------------------

---[FILE: template.go]---
Location: harness-main/app/api/request/template.go
Signals: N/A
Excerpt (<=80 chars):  func GetTemplateRefFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetTemplateRefFromPath
- GetTemplateTypeFromPath
```

--------------------------------------------------------------------------------

---[FILE: time.go]---
Location: harness-main/app/api/request/time.go
Signals: N/A
Excerpt (<=80 chars):  func QueryParamAsUnixMillisOrDefault(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryParamAsUnixMillisOrDefault
```

--------------------------------------------------------------------------------

---[FILE: token.go]---
Location: harness-main/app/api/request/token.go
Signals: N/A
Excerpt (<=80 chars):  func GetTokenIdentifierFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetTokenIdentifierFromPath
```

--------------------------------------------------------------------------------

---[FILE: util.go]---
Location: harness-main/app/api/request/util.go
Signals: N/A
Excerpt (<=80 chars): func GetCookie(r *http.Request, cookieName string) (string, bool) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetCookie
- GetHeaderOrDefault
- GetHeader
- PathParamOrError
- PathParamOrEmpty
- PathParam
- QueryParam
- QueryParamList
- QueryParamOrDefault
- QueryParamOrError
- QueryParamAsPositiveInt64OrDefault
- QueryParamAsPositiveInt64OrError
- QueryParamAsPositiveInt64
- PathParamAsPositiveInt64
- QueryParamAsBoolOrDefault
- QueryParamListAsPositiveInt64
```

--------------------------------------------------------------------------------

---[FILE: webhook.go]---
Location: harness-main/app/api/request/webhook.go
Signals: N/A
Excerpt (<=80 chars):  func GetWebhookIdentifierFromPath(r *http.Request) (string, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetWebhookIdentifierFromPath
- GetWebhookExecutionIDFromPath
- ParseWebhookFilter
- ParseWebhookExecutionFilter
- ParseSortWebhook
```

--------------------------------------------------------------------------------

---[FILE: translate.go]---
Location: harness-main/app/api/usererror/translate.go
Signals: N/A
Excerpt (<=80 chars):  func Translate(ctx context.Context, err error) *Error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Translate
- errorFromLockError
- httpStatusCode
```

--------------------------------------------------------------------------------

---[FILE: usererror.go]---
Location: harness-main/app/api/usererror/usererror.go
Signals: N/A
Excerpt (<=80 chars): type Error struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Error
- New
- Newf
- NewWithPayload
- BadRequest
- BadRequestf
- RequestTooLargef
- UnprocessableEntity
- UnprocessableEntityf
- BadRequestWithPayload
- Forbidden
- MethodNotAllowed
- NotFound
- NotFoundf
- ConflictWithPayload
- Conflict
```

--------------------------------------------------------------------------------

---[FILE: usererror_test.go]---
Location: harness-main/app/api/usererror/usererror_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestError(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestError
```

--------------------------------------------------------------------------------

---[FILE: anonymous.go]---
Location: harness-main/app/auth/anonymous.go
Signals: N/A
Excerpt (<=80 chars):  func IsAnonymousSession(session *Session) bool {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IsAnonymousSession
```

--------------------------------------------------------------------------------

---[FILE: metadata.go]---
Location: harness-main/app/auth/metadata.go
Signals: N/A
Excerpt (<=80 chars):  type Metadata interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Metadata
- EmptyMetadata
- TokenMetadata
- MembershipMetadata
- AccessPermissionMetadata
- ImpactsAuthorization
```

--------------------------------------------------------------------------------

---[FILE: session.go]---
Location: harness-main/app/auth/session.go
Signals: N/A
Excerpt (<=80 chars): type Session struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Session
```

--------------------------------------------------------------------------------

---[FILE: authenticator.go]---
Location: harness-main/app/auth/authn/authenticator.go
Signals: N/A
Excerpt (<=80 chars): type Authenticator interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Authenticator
```

--------------------------------------------------------------------------------

---[FILE: jwt.go]---
Location: harness-main/app/auth/authn/jwt.go
Signals: N/A
Excerpt (<=80 chars): type JWTAuthenticator struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JWTAuthenticator
- NewTokenAuthenticator
- Authenticate
- metadataFromTokenClaims
- metadataFromMembershipClaims
- metadataFromAccessPermissions
- extractToken
- createSessionFromClaims
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/auth/authn/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideAuthenticator(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideAuthenticator
```

--------------------------------------------------------------------------------

---[FILE: authz.go]---
Location: harness-main/app/auth/authz/authz.go
Signals: N/A
Excerpt (<=80 chars): type Authorizer interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Authorizer
```

--------------------------------------------------------------------------------

---[FILE: membership.go]---
Location: harness-main/app/auth/authz/membership.go
Signals: N/A
Excerpt (<=80 chars):  type MembershipAuthorizer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipAuthorizer
- NewMembershipAuthorizer
- Check
- CheckAll
- checkWithMembershipMetadata
- checkWithAccessPermissionMetadata
```

--------------------------------------------------------------------------------

---[FILE: membership_cache.go]---
Location: harness-main/app/auth/authz/membership_cache.go
Signals: N/A
Excerpt (<=80 chars):  type PermissionCacheKey struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PermissionCacheKey
- permissionCacheGetter
- NewPermissionCache
- Find
- roleHasPermission
- findFirstExistingSpace
```

--------------------------------------------------------------------------------

---[FILE: public_access.go]---
Location: harness-main/app/auth/authz/public_access.go
Signals: N/A
Excerpt (<=80 chars): func CheckPublicAccess(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckPublicAccess
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/auth/authz/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideAuthorizer(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideAuthorizer
- ProvidePermissionCache
```

--------------------------------------------------------------------------------

---[FILE: bootstrap.go]---
Location: harness-main/app/bootstrap/bootstrap.go
Signals: N/A
Excerpt (<=80 chars):  func NewSystemServiceSession() *auth.Session {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewSystemServiceSession
- NewPipelineServiceSession
- NewGitspaceServiceSession
- System
- AdminUser
- createAdminUser
- SystemService
- PipelineService
- GitspaceService
- createServicePrincipal
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/bootstrap/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideBootstrap(config *types.Config, userCtrl *user.Controller,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideBootstrap
```

--------------------------------------------------------------------------------

---[FILE: connector.go]---
Location: harness-main/app/connector/connector.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- New
- Test
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/connector/wire.go
Signals: N/A
Excerpt (<=80 chars): func ProvideConnectorHandler(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideConnectorHandler
- ProvideSCMConnectorHandler
```

--------------------------------------------------------------------------------

---[FILE: provider.go]---
Location: harness-main/app/connector/scm/provider.go
Signals: N/A
Excerpt (<=80 chars): func getSCMProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSCMProvider
- oauthTransport
- defaultTransport
- resolveSecret
```

--------------------------------------------------------------------------------

---[FILE: scm.go]---
Location: harness-main/app/connector/scm/scm.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- Test
```

--------------------------------------------------------------------------------

---[FILE: nightly.go]---
Location: harness-main/app/cron/nightly.go
Signals: N/A
Excerpt (<=80 chars): type Nightly struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Nightly
- NewNightly
- Run
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/events/aitask/events.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmitAITaskEvent
- RegisterAITaskEvent
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/aitask/reader.go
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
Location: harness-main/app/events/aitask/reporter.go
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
Location: harness-main/app/events/aitask/wire.go
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
Location: harness-main/app/events/check/events.go
Signals: N/A
Excerpt (<=80 chars):  type Base struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Base
```

--------------------------------------------------------------------------------

---[FILE: events_check_reported.go]---
Location: harness-main/app/events/check/events_check_reported.go
Signals: N/A
Excerpt (<=80 chars):  type ReportedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReportedPayload
- Reported
- RegisterReported
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/check/reader.go
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
Location: harness-main/app/events/check/reporter.go
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
Location: harness-main/app/events/check/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideReporter
```

--------------------------------------------------------------------------------

---[FILE: branch.go]---
Location: harness-main/app/events/git/branch.go
Signals: N/A
Excerpt (<=80 chars):  type BranchCreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BranchCreatedPayload
- BranchUpdatedPayload
- BranchDeletedPayload
- BranchCreated
- RegisterBranchCreated
- BranchUpdated
- RegisterBranchUpdated
- BranchDeleted
- RegisterBranchDeleted
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/git/reader.go
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
Location: harness-main/app/events/git/reporter.go
Signals: N/A
Excerpt (<=80 chars): type Reporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- NewReporter
```

--------------------------------------------------------------------------------

---[FILE: tag.go]---
Location: harness-main/app/events/git/tag.go
Signals: N/A
Excerpt (<=80 chars):  type TagCreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagCreatedPayload
- TagUpdatedPayload
- TagDeletedPayload
- TagCreated
- RegisterTagCreated
- TagUpdated
- RegisterTagUpdated
- TagDeleted
- RegisterTagDeleted
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/events/git/wire.go
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
Location: harness-main/app/events/gitspace/events.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmitGitspaceEvent
- RegisterGitspaceEvent
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/gitspace/reader.go
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
Location: harness-main/app/events/gitspace/reporter.go
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
Location: harness-main/app/events/gitspace/wire.go
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
Location: harness-main/app/events/gitspacedelete/events.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmitGitspaceDeleteEvent
- RegisterGitspaceDeleteEvent
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/gitspacedelete/reader.go
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
Location: harness-main/app/events/gitspacedelete/reporter.go
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
Location: harness-main/app/events/gitspacedelete/wire.go
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
Location: harness-main/app/events/gitspaceinfra/events.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmitGitspaceInfraEvent
- RegisterGitspaceInfraEvent
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/gitspaceinfra/reader.go
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
Location: harness-main/app/events/gitspaceinfra/reporter.go
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
Location: harness-main/app/events/gitspaceinfra/wire.go
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
Location: harness-main/app/events/gitspaceoperations/events.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmitGitspaceOperationsEvent
- RegisterGitspaceOperationsEvent
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/gitspaceoperations/reader.go
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
Location: harness-main/app/events/gitspaceoperations/reporter.go
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
Location: harness-main/app/events/gitspaceoperations/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideReaderFactory(eventsSystem *events.System) (*events.ReaderFactor...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideReaderFactory
- ProvideReporter
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/events/pipeline/create.go
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

---[FILE: execute.go]---
Location: harness-main/app/events/pipeline/execute.go
Signals: N/A
Excerpt (<=80 chars):  type ExecutedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutedPayload
- Executed
- RegisterExecuted
```

--------------------------------------------------------------------------------

---[FILE: reader.go]---
Location: harness-main/app/events/pipeline/reader.go
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
Location: harness-main/app/events/pipeline/reporter.go
Signals: N/A
Excerpt (<=80 chars): type Reporter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reporter
- NewReporter
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/events/pipeline/update.go
Signals: N/A
Excerpt (<=80 chars):  type UpdatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdatedPayload
- Updated
- RegisterUpdated
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/events/pipeline/wire.go
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
Location: harness-main/app/events/pullreq/events.go
Signals: N/A
Excerpt (<=80 chars):  type Base struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Base
```

--------------------------------------------------------------------------------

---[FILE: events_branch.go]---
Location: harness-main/app/events/pullreq/events_branch.go
Signals: N/A
Excerpt (<=80 chars):  type BranchUpdatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BranchUpdatedPayload
- TargetBranchChangedPayload
- BranchUpdated
- RegisterBranchUpdated
- TargetBranchChanged
- RegisterTargetBranchChanged
```

--------------------------------------------------------------------------------

---[FILE: events_code_comment_status.go]---
Location: harness-main/app/events/pullreq/events_code_comment_status.go
Signals: N/A
Excerpt (<=80 chars):  type CommentStatusUpdatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentStatusUpdatedPayload
- CommentStatusUpdated
- RegisterCommentStatusUpdated
```

--------------------------------------------------------------------------------

---[FILE: events_code_comment_updated.go]---
Location: harness-main/app/events/pullreq/events_code_comment_updated.go
Signals: N/A
Excerpt (<=80 chars):  type CommentUpdatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentUpdatedPayload
- CommentUpdated
- RegisterCommentUpdated
```

--------------------------------------------------------------------------------

---[FILE: events_comment_created.go]---
Location: harness-main/app/events/pullreq/events_comment_created.go
Signals: N/A
Excerpt (<=80 chars):  type CommentCreatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentCreatedPayload
- CommentCreated
- RegisterCommentCreated
```

--------------------------------------------------------------------------------

---[FILE: events_label_assigned.go]---
Location: harness-main/app/events/pullreq/events_label_assigned.go
Signals: N/A
Excerpt (<=80 chars):  type LabelAssignedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LabelAssignedPayload
- LabelAssigned
- RegisterLabelAssigned
```

--------------------------------------------------------------------------------

````
