---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 4
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 4 of 37)

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

---[FILE: wire.go]---
Location: harness-main/app/api/controller/user/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/usergroup/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getSpaceCheckAuth
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/controller/usergroup/list.go
Signals: N/A
Excerpt (<=80 chars):  func (c Controller) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/usergroup/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
```

--------------------------------------------------------------------------------

---[FILE: controller.go]---
Location: harness-main/app/api/controller/webhook/controller.go
Signals: N/A
Excerpt (<=80 chars):  type Controller struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewController
- getRepoCheckAccess
- getSpaceCheckAccess
```

--------------------------------------------------------------------------------

---[FILE: preprocessor.go]---
Location: harness-main/app/api/controller/webhook/preprocessor.go
Signals: N/A
Excerpt (<=80 chars):  type Preprocessor interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Preprocessor
- NoopPreprocessor
- PreprocessCreateInput
- PreprocessUpdateInput
- PreprocessFilter
- IsInternalCall
```

--------------------------------------------------------------------------------

---[FILE: repo_create.go]---
Location: harness-main/app/api/controller/webhook/repo_create.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) CreateRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_delete.go]---
Location: harness-main/app/api/controller/webhook/repo_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_find.go]---
Location: harness-main/app/api/controller/webhook/repo_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FindRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_find_execution.go]---
Location: harness-main/app/api/controller/webhook/repo_find_execution.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FindExecutionRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindExecutionRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_list.go]---
Location: harness-main/app/api/controller/webhook/repo_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_list_executions.go]---
Location: harness-main/app/api/controller/webhook/repo_list_executions.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListExecutionsRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListExecutionsRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_retrigger_execution.go]---
Location: harness-main/app/api/controller/webhook/repo_retrigger_execution.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RetriggerExecutionRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetriggerExecutionRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_update.go]---
Location: harness-main/app/api/controller/webhook/repo_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UpdateRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateRepo
```

--------------------------------------------------------------------------------

---[FILE: space_create.go]---
Location: harness-main/app/api/controller/webhook/space_create.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) CreateSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateSpace
```

--------------------------------------------------------------------------------

---[FILE: space_delete.go]---
Location: harness-main/app/api/controller/webhook/space_delete.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) DeleteSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteSpace
```

--------------------------------------------------------------------------------

---[FILE: space_find.go]---
Location: harness-main/app/api/controller/webhook/space_find.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FindSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindSpace
```

--------------------------------------------------------------------------------

---[FILE: space_find_execution.go]---
Location: harness-main/app/api/controller/webhook/space_find_execution.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) FindExecutionSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FindExecutionSpace
```

--------------------------------------------------------------------------------

---[FILE: space_list.go]---
Location: harness-main/app/api/controller/webhook/space_list.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListSpace
```

--------------------------------------------------------------------------------

---[FILE: space_list_executions.go]---
Location: harness-main/app/api/controller/webhook/space_list_executions.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) ListExecutionsSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListExecutionsSpace
```

--------------------------------------------------------------------------------

---[FILE: space_retrigger_execution.go]---
Location: harness-main/app/api/controller/webhook/space_retrigger_execution.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) RetriggerExecutionSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetriggerExecutionSpace
```

--------------------------------------------------------------------------------

---[FILE: space_update.go]---
Location: harness-main/app/api/controller/webhook/space_update.go
Signals: N/A
Excerpt (<=80 chars): func (c *Controller) UpdateSpace(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateSpace
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/controller/webhook/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideController(authorizer authz.Authorizer,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideController
- ProvidePreprocessor
```

--------------------------------------------------------------------------------

---[FILE: cookie.go]---
Location: harness-main/app/api/handler/account/cookie.go
Signals: N/A
Excerpt (<=80 chars):  func includeTokenCookie(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- includeTokenCookie
- deleteTokenCookieIfPresent
- newEmptyTokenCookie
```

--------------------------------------------------------------------------------

---[FILE: login.go]---
Location: harness-main/app/api/handler/account/login.go
Signals: N/A
Excerpt (<=80 chars): func HandleLogin(userCtrl *user.Controller, cookieName string) http.HandlerFu...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLogin
```

--------------------------------------------------------------------------------

---[FILE: login_test.go]---
Location: harness-main/app/api/handler/account/login_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestLogin(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestLogin
- TestLogin_NotFound
- TestLogin_BcryptError
- TestLogin_TokenError
```

--------------------------------------------------------------------------------

---[FILE: logout.go]---
Location: harness-main/app/api/handler/account/logout.go
Signals: N/A
Excerpt (<=80 chars): func HandleLogout(userCtrl *user.Controller, cookieName string) http.HandlerF...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLogout
```

--------------------------------------------------------------------------------

---[FILE: register.go]---
Location: harness-main/app/api/handler/account/register.go
Signals: N/A
Excerpt (<=80 chars): func HandleRegister(userCtrl *user.Controller, sysCtrl *system.Controller, co...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRegister
```

--------------------------------------------------------------------------------

---[FILE: register_test.go]---
Location: harness-main/app/api/handler/account/register_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestRegiser(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRegiser
- TestRegiserAdmin
- TestRegiser_CreateError
- TestRegiser_BcryptError
- TestRegiser_TokenError
```

--------------------------------------------------------------------------------

---[FILE: check_list.go]---
Location: harness-main/app/api/handler/check/check_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleCheckList(checkCtrl *check.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCheckList
```

--------------------------------------------------------------------------------

---[FILE: check_recent.go]---
Location: harness-main/app/api/handler/check/check_recent.go
Signals: N/A
Excerpt (<=80 chars): func HandleCheckListRecent(checkCtrl *check.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCheckListRecent
```

--------------------------------------------------------------------------------

---[FILE: check_recent_space.go]---
Location: harness-main/app/api/handler/check/check_recent_space.go
Signals: N/A
Excerpt (<=80 chars): func HandleCheckListRecentSpace(checkCtrl *check.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCheckListRecentSpace
```

--------------------------------------------------------------------------------

---[FILE: check_report.go]---
Location: harness-main/app/api/handler/check/check_report.go
Signals: N/A
Excerpt (<=80 chars): func HandleCheckReport(checkCtrl *check.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCheckReport
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/connector/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(connectorCtrl *connector.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/connector/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDelete(connectorCtrl *connector.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/connector/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(connectorCtrl *connector.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: test.go]---
Location: harness-main/app/api/handler/connector/test.go
Signals: N/A
Excerpt (<=80 chars):  func HandleTest(connectorCtrl *connector.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleTest
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/connector/update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdate(connectorCtrl *connector.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: cancel.go]---
Location: harness-main/app/api/handler/execution/cancel.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCancel(executionCtrl *execution.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCancel
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/execution/create.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCreate(executionCtrl *execution.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/execution/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDelete(executionCtrl *execution.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/execution/find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFind(executionCtrl *execution.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/handler/execution/list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleList(executionCtrl *execution.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleList
```

--------------------------------------------------------------------------------

---[FILE: post_receive.go]---
Location: harness-main/app/api/handler/githook/post_receive.go
Signals: N/A
Excerpt (<=80 chars): func HandlePostReceive(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePostReceive
```

--------------------------------------------------------------------------------

---[FILE: pre_receive.go]---
Location: harness-main/app/api/handler/githook/pre_receive.go
Signals: N/A
Excerpt (<=80 chars): func HandlePreReceive(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePreReceive
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/githook/update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: action.go]---
Location: harness-main/app/api/handler/gitspace/action.go
Signals: N/A
Excerpt (<=80 chars):  func HandleAction(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleAction
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/gitspace/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateConfig(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateConfig
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/gitspace/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDeleteConfig(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteConfig
```

--------------------------------------------------------------------------------

---[FILE: events.go]---
Location: harness-main/app/api/handler/gitspace/events.go
Signals: N/A
Excerpt (<=80 chars):  func HandleEvents(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleEvents
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/gitspace/find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFind(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: list_all_gitspaces.go]---
Location: harness-main/app/api/handler/gitspace/list_all_gitspaces.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListAllGitspaces(gitspaceCtrl *gitspace.Controller) http.HandlerF...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListAllGitspaces
```

--------------------------------------------------------------------------------

---[FILE: logs_stream.go]---
Location: harness-main/app/api/handler/gitspace/logs_stream.go
Signals: N/A
Excerpt (<=80 chars):  func HandleLogsStream(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLogsStream
```

--------------------------------------------------------------------------------

---[FILE: lookup_repo.go]---
Location: harness-main/app/api/handler/gitspace/lookup_repo.go
Signals: N/A
Excerpt (<=80 chars):  func HandleLookupRepo(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLookupRepo
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/gitspace/update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdateConfig(gitspaceCtrl *gitspace.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateConfig
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/infraprovider/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateConfig(infraProviderCtrl *infraprovider.Controller) http.Han...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateConfig
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/infraprovider/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDelete(infraProviderCtrl *infraprovider.Controller) http.HandlerF...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/infraprovider/find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFind(infraProviderCtrl *infraprovider.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: search.go]---
Location: harness-main/app/api/handler/keywordsearch/search.go
Signals: N/A
Excerpt (<=80 chars): func HandleSearch(ctrl *keywordsearch.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSearch
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/app/api/handler/lfs/download.go
Signals: N/A
Excerpt (<=80 chars):  func HandleLFSDownload(controller *lfs.Controller, urlProvider url.Provider)...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLFSDownload
```

--------------------------------------------------------------------------------

---[FILE: transfer.go]---
Location: harness-main/app/api/handler/lfs/transfer.go
Signals: N/A
Excerpt (<=80 chars):  func HandleLFSTransfer(lfsCtrl *lfs.Controller, urlProvider url.Provider) ht...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLFSTransfer
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/app/api/handler/lfs/upload.go
Signals: N/A
Excerpt (<=80 chars):  func HandleLFSUpload(controller *lfs.Controller, urlProvider url.Provider) h...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLFSUpload
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/logs/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(logCtrl *logs.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: tail.go]---
Location: harness-main/app/api/handler/logs/tail.go
Signals: N/A
Excerpt (<=80 chars): func HandleTail(logCtrl *logs.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleTail
```

--------------------------------------------------------------------------------

---[FILE: create_repo.go]---
Location: harness-main/app/api/handler/migrate/create_repo.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateRepo(migCtrl *migrate.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateRepo
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/app/api/handler/migrate/label.go
Signals: N/A
Excerpt (<=80 chars): func HandleLabels(migCtrl *migrate.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleLabels
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/app/api/handler/migrate/pullreq.go
Signals: N/A
Excerpt (<=80 chars): func HandlePullRequests(migCtrl *migrate.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePullRequests
```

--------------------------------------------------------------------------------

---[FILE: rules.go]---
Location: harness-main/app/api/handler/migrate/rules.go
Signals: N/A
Excerpt (<=80 chars): func HandleRules(migCtrl *migrate.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRules
```

--------------------------------------------------------------------------------

---[FILE: update_state.go]---
Location: harness-main/app/api/handler/migrate/update_state.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdateRepoState(migCtrl *migrate.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateRepoState
```

--------------------------------------------------------------------------------

---[FILE: webhooks.go]---
Location: harness-main/app/api/handler/migrate/webhooks.go
Signals: N/A
Excerpt (<=80 chars): func HandleWebhooks(migCtrl *migrate.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleWebhooks
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/pipeline/create.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCreate(pipelineCtrl *pipeline.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/pipeline/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDelete(pipelineCtrl *pipeline.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/pipeline/find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFind(pipelineCtrl *pipeline.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/pipeline/update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdate(pipelineCtrl *pipeline.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/handler/plugin/list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleList(pluginCtrl *plugin.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleList
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/principal/find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFind(principalCtrl principal.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: find_by_email.go]---
Location: harness-main/app/api/handler/principal/find_by_email.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCheckExistenceByEmail(principalCtrl principal.Controller) http.Ha...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCheckExistenceByEmail
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/handler/principal/list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleList(principalCtrl principal.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleList
```

--------------------------------------------------------------------------------

---[FILE: activity_list.go]---
Location: harness-main/app/api/handler/pullreq/activity_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleListActivities(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListActivities
```

--------------------------------------------------------------------------------

---[FILE: branch_change_target.go]---
Location: harness-main/app/api/handler/pullreq/branch_change_target.go
Signals: N/A
Excerpt (<=80 chars):  func HandleChangeTargetBranch(pullreqCtrl *pullreq.Controller) http.HandlerF...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleChangeTargetBranch
```

--------------------------------------------------------------------------------

---[FILE: branch_delete.go]---
Location: harness-main/app/api/handler/pullreq/branch_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleDeleteBranch(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteBranch
```

--------------------------------------------------------------------------------

---[FILE: branch_restore.go]---
Location: harness-main/app/api/handler/pullreq/branch_restore.go
Signals: N/A
Excerpt (<=80 chars): func HandleRestoreBranch(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRestoreBranch
```

--------------------------------------------------------------------------------

---[FILE: check_list.go]---
Location: harness-main/app/api/handler/pullreq/check_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCheckList(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCheckList
```

--------------------------------------------------------------------------------

---[FILE: codeowner.go]---
Location: harness-main/app/api/handler/pullreq/codeowner.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCodeOwner(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCodeOwner
```

--------------------------------------------------------------------------------

---[FILE: comment_apply_suggestions.go]---
Location: harness-main/app/api/handler/pullreq/comment_apply_suggestions.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCommentApplySuggestions(pullreqCtrl *pullreq.Controller) http.Han...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCommentApplySuggestions
```

--------------------------------------------------------------------------------

---[FILE: comment_create.go]---
Location: harness-main/app/api/handler/pullreq/comment_create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCommentCreate(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCommentCreate
```

--------------------------------------------------------------------------------

---[FILE: comment_delete.go]---
Location: harness-main/app/api/handler/pullreq/comment_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleCommentDelete(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCommentDelete
```

--------------------------------------------------------------------------------

---[FILE: comment_status.go]---
Location: harness-main/app/api/handler/pullreq/comment_status.go
Signals: N/A
Excerpt (<=80 chars): func HandleCommentStatus(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCommentStatus
```

--------------------------------------------------------------------------------

---[FILE: comment_update.go]---
Location: harness-main/app/api/handler/pullreq/comment_update.go
Signals: N/A
Excerpt (<=80 chars): func HandleCommentUpdate(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCommentUpdate
```

--------------------------------------------------------------------------------

---[FILE: file_view_add.go]---
Location: harness-main/app/api/handler/pullreq/file_view_add.go
Signals: N/A
Excerpt (<=80 chars): func HandleFileViewAdd(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFileViewAdd
```

--------------------------------------------------------------------------------

---[FILE: file_view_delete.go]---
Location: harness-main/app/api/handler/pullreq/file_view_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleFileViewDelete(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFileViewDelete
```

--------------------------------------------------------------------------------

---[FILE: file_view_list.go]---
Location: harness-main/app/api/handler/pullreq/file_view_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleFileViewList(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFileViewList
```

--------------------------------------------------------------------------------

---[FILE: label_assign.go]---
Location: harness-main/app/api/handler/pullreq/label_assign.go
Signals: N/A
Excerpt (<=80 chars):  func HandleAssignLabel(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleAssignLabel
```

--------------------------------------------------------------------------------

---[FILE: label_list.go]---
Location: harness-main/app/api/handler/pullreq/label_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListLabels(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListLabels
```

--------------------------------------------------------------------------------

---[FILE: label_unassign.go]---
Location: harness-main/app/api/handler/pullreq/label_unassign.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUnassignLabel(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUnassignLabel
```

--------------------------------------------------------------------------------

---[FILE: merge.go]---
Location: harness-main/app/api/handler/pullreq/merge.go
Signals: N/A
Excerpt (<=80 chars): func HandleMerge(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMerge
```

--------------------------------------------------------------------------------

---[FILE: pr_branch_candidates.go]---
Location: harness-main/app/api/handler/pullreq/pr_branch_candidates.go
Signals: N/A
Excerpt (<=80 chars): func HandlePRBranchCandidates(pullreqCtrl *pullreq.Controller) http.HandlerFu...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePRBranchCandidates
```

--------------------------------------------------------------------------------

---[FILE: pr_commits.go]---
Location: harness-main/app/api/handler/pullreq/pr_commits.go
Signals: N/A
Excerpt (<=80 chars): func HandleCommits(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCommits
```

--------------------------------------------------------------------------------

---[FILE: pr_create.go]---
Location: harness-main/app/api/handler/pullreq/pr_create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: pr_diff.go]---
Location: harness-main/app/api/handler/pullreq/pr_diff.go
Signals: N/A
Excerpt (<=80 chars): func HandleDiff(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDiff
```

--------------------------------------------------------------------------------

---[FILE: pr_find.go]---
Location: harness-main/app/api/handler/pullreq/pr_find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
- HandleFindByBranches
```

--------------------------------------------------------------------------------

---[FILE: pr_list.go]---
Location: harness-main/app/api/handler/pullreq/pr_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleList(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleList
```

--------------------------------------------------------------------------------

---[FILE: pr_metadata.go]---
Location: harness-main/app/api/handler/pullreq/pr_metadata.go
Signals: N/A
Excerpt (<=80 chars): func HandleMetadata(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMetadata
```

--------------------------------------------------------------------------------

---[FILE: pr_state.go]---
Location: harness-main/app/api/handler/pullreq/pr_state.go
Signals: N/A
Excerpt (<=80 chars): func HandleState(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleState
```

--------------------------------------------------------------------------------

---[FILE: pr_update.go]---
Location: harness-main/app/api/handler/pullreq/pr_update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdate(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: revert.go]---
Location: harness-main/app/api/handler/pullreq/revert.go
Signals: N/A
Excerpt (<=80 chars):  func HandleRevert(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRevert
```

--------------------------------------------------------------------------------

---[FILE: reviewer_add.go]---
Location: harness-main/app/api/handler/pullreq/reviewer_add.go
Signals: N/A
Excerpt (<=80 chars): func HandleReviewerAdd(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleReviewerAdd
```

--------------------------------------------------------------------------------

---[FILE: reviewer_combined_list.go]---
Location: harness-main/app/api/handler/pullreq/reviewer_combined_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleReviewerCombinedList(pullreqCtrl *pullreq.Controller) http.Handler...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleReviewerCombinedList
```

--------------------------------------------------------------------------------

---[FILE: reviewer_delete.go]---
Location: harness-main/app/api/handler/pullreq/reviewer_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleReviewerDelete(pullreqCtrl *pullreq.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleReviewerDelete
```

--------------------------------------------------------------------------------

````
