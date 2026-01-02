---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 6
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 6 of 37)

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

---[FILE: membership_list.go]---
Location: harness-main/app/api/handler/space/membership_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleMembershipList(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMembershipList
```

--------------------------------------------------------------------------------

---[FILE: membership_update.go]---
Location: harness-main/app/api/handler/space/membership_update.go
Signals: N/A
Excerpt (<=80 chars): func HandleMembershipUpdate(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMembershipUpdate
```

--------------------------------------------------------------------------------

---[FILE: move.go]---
Location: harness-main/app/api/handler/space/move.go
Signals: N/A
Excerpt (<=80 chars): func HandleMove(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMove
```

--------------------------------------------------------------------------------

---[FILE: pr_count.go]---
Location: harness-main/app/api/handler/space/pr_count.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCountPullReqs(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCountPullReqs
```

--------------------------------------------------------------------------------

---[FILE: pr_list.go]---
Location: harness-main/app/api/handler/space/pr_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListPullReqs(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListPullReqs
```

--------------------------------------------------------------------------------

---[FILE: purge.go]---
Location: harness-main/app/api/handler/space/purge.go
Signals: N/A
Excerpt (<=80 chars): func HandlePurge(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandlePurge
```

--------------------------------------------------------------------------------

---[FILE: restore.go]---
Location: harness-main/app/api/handler/space/restore.go
Signals: N/A
Excerpt (<=80 chars): func HandleRestore(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRestore
```

--------------------------------------------------------------------------------

---[FILE: rule_create.go]---
Location: harness-main/app/api/handler/space/rule_create.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleCreate(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleCreate
```

--------------------------------------------------------------------------------

---[FILE: rule_delete.go]---
Location: harness-main/app/api/handler/space/rule_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleDelete(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleDelete
```

--------------------------------------------------------------------------------

---[FILE: rule_find.go]---
Location: harness-main/app/api/handler/space/rule_find.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleFind(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleFind
```

--------------------------------------------------------------------------------

---[FILE: rule_list.go]---
Location: harness-main/app/api/handler/space/rule_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleList(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleList
```

--------------------------------------------------------------------------------

---[FILE: rule_update.go]---
Location: harness-main/app/api/handler/space/rule_update.go
Signals: N/A
Excerpt (<=80 chars): func HandleRuleUpdate(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRuleUpdate
```

--------------------------------------------------------------------------------

---[FILE: soft_delete.go]---
Location: harness-main/app/api/handler/space/soft_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleSoftDelete(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleSoftDelete
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/space/update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdate(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: update_public_access.go]---
Location: harness-main/app/api/handler/space/update_public_access.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdatePublicAccess(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdatePublicAccess
```

--------------------------------------------------------------------------------

---[FILE: usage.go]---
Location: harness-main/app/api/handler/space/usage.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUsageMetric(spaceCtrl *space.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUsageMetric
```

--------------------------------------------------------------------------------

---[FILE: health.go]---
Location: harness-main/app/api/handler/system/health.go
Signals: N/A
Excerpt (<=80 chars): func HandleHealth(w http.ResponseWriter, _ *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleHealth
```

--------------------------------------------------------------------------------

---[FILE: health_test.go]---
Location: harness-main/app/api/handler/system/health_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestHealth(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestHealth
```

--------------------------------------------------------------------------------

---[FILE: list_config.go]---
Location: harness-main/app/api/handler/system/list_config.go
Signals: N/A
Excerpt (<=80 chars):  type UI struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UI
- ConfigOutput
- HandleGetConfig
```

--------------------------------------------------------------------------------

---[FILE: version.go]---
Location: harness-main/app/api/handler/system/version.go
Signals: N/A
Excerpt (<=80 chars): func HandleVersion(w http.ResponseWriter, _ *http.Request) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleVersion
```

--------------------------------------------------------------------------------

---[FILE: version_test.go]---
Location: harness-main/app/api/handler/system/version_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestVersion(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestVersion
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/template/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(templateCtrl *template.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/template/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDelete(templateCtrl *template.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/template/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(templateCtrl *template.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/template/update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdate(templateCtrl *template.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/trigger/create.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCreate(triggerCtrl *trigger.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/trigger/delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDelete(triggerCtrl *trigger.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/trigger/find.go
Signals: N/A
Excerpt (<=80 chars):  func HandleFind(triggerCtrl *trigger.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/handler/trigger/list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleList(triggerCtrl *trigger.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleList
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/trigger/update.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdate(triggerCtrl *trigger.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: download.go]---
Location: harness-main/app/api/handler/upload/download.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDownoad(controller *upload.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDownoad
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/app/api/handler/upload/upload.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpload(controller *upload.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpload
```

--------------------------------------------------------------------------------

---[FILE: create_access_token.go]---
Location: harness-main/app/api/handler/user/create_access_token.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateAccessToken(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateAccessToken
```

--------------------------------------------------------------------------------

---[FILE: create_favorite.go]---
Location: harness-main/app/api/handler/user/create_favorite.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateFavorite(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateFavorite
```

--------------------------------------------------------------------------------

---[FILE: delete_favorite.go]---
Location: harness-main/app/api/handler/user/delete_favorite.go
Signals: N/A
Excerpt (<=80 chars): func HandleDeleteFavorite(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteFavorite
```

--------------------------------------------------------------------------------

---[FILE: delete_token.go]---
Location: harness-main/app/api/handler/user/delete_token.go
Signals: N/A
Excerpt (<=80 chars): func HandleDeleteToken(userCtrl *user.Controller, tokenType enum.TokenType) h...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteToken
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/user/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: list_tokens.go]---
Location: harness-main/app/api/handler/user/list_tokens.go
Signals: N/A
Excerpt (<=80 chars): func HandleListTokens(userCtrl *user.Controller, tokenType enum.TokenType) ht...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListTokens
```

--------------------------------------------------------------------------------

---[FILE: membership_spaces.go]---
Location: harness-main/app/api/handler/user/membership_spaces.go
Signals: N/A
Excerpt (<=80 chars):  func HandleMembershipSpaces(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleMembershipSpaces
```

--------------------------------------------------------------------------------

---[FILE: publickey_create.go]---
Location: harness-main/app/api/handler/user/publickey_create.go
Signals: N/A
Excerpt (<=80 chars):  func HandleCreatePublicKey(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreatePublicKey
```

--------------------------------------------------------------------------------

---[FILE: publickey_delete.go]---
Location: harness-main/app/api/handler/user/publickey_delete.go
Signals: N/A
Excerpt (<=80 chars):  func HandleDeletePublicKey(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeletePublicKey
```

--------------------------------------------------------------------------------

---[FILE: publickey_edit.go]---
Location: harness-main/app/api/handler/user/publickey_edit.go
Signals: N/A
Excerpt (<=80 chars):  func HandleUpdatePublicKey(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdatePublicKey
```

--------------------------------------------------------------------------------

---[FILE: publickey_list.go]---
Location: harness-main/app/api/handler/user/publickey_list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleListPublicKeys(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListPublicKeys
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/user/update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdate(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: update_admin.go]---
Location: harness-main/app/api/handler/user/update_admin.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdateAdmin(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateAdmin
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/handler/usergroup/list.go
Signals: N/A
Excerpt (<=80 chars):  func HandleList(usergroupCtrl *usergroup.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleList
```

--------------------------------------------------------------------------------

---[FILE: create.go]---
Location: harness-main/app/api/handler/users/create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreate(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreate
```

--------------------------------------------------------------------------------

---[FILE: delete.go]---
Location: harness-main/app/api/handler/users/delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleDelete(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDelete
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/api/handler/users/find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFind(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFind
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/api/handler/users/list.go
Signals: N/A
Excerpt (<=80 chars): func HandleList(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleList
```

--------------------------------------------------------------------------------

---[FILE: update.go]---
Location: harness-main/app/api/handler/users/update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdate(userCtrl *user.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdate
```

--------------------------------------------------------------------------------

---[FILE: repo_create.go]---
Location: harness-main/app/api/handler/webhook/repo_create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateRepo(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_delete.go]---
Location: harness-main/app/api/handler/webhook/repo_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleDeleteRepo(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_find.go]---
Location: harness-main/app/api/handler/webhook/repo_find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFindRepo(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFindRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_find_execution.go]---
Location: harness-main/app/api/handler/webhook/repo_find_execution.go
Signals: N/A
Excerpt (<=80 chars): func HandleFindExecutionRepo(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFindExecutionRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_list.go]---
Location: harness-main/app/api/handler/webhook/repo_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleListRepo(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_list_executions.go]---
Location: harness-main/app/api/handler/webhook/repo_list_executions.go
Signals: N/A
Excerpt (<=80 chars): func HandleListExecutionsRepo(webhookCtrl *webhook.Controller) http.HandlerFu...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListExecutionsRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_retrigger_execution.go]---
Location: harness-main/app/api/handler/webhook/repo_retrigger_execution.go
Signals: N/A
Excerpt (<=80 chars): func HandleRetriggerExecutionRepo(webhookCtrl *webhook.Controller) http.Handl...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRetriggerExecutionRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_update.go]---
Location: harness-main/app/api/handler/webhook/repo_update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdateRepo(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateRepo
```

--------------------------------------------------------------------------------

---[FILE: space_create.go]---
Location: harness-main/app/api/handler/webhook/space_create.go
Signals: N/A
Excerpt (<=80 chars): func HandleCreateSpace(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleCreateSpace
```

--------------------------------------------------------------------------------

---[FILE: space_delete.go]---
Location: harness-main/app/api/handler/webhook/space_delete.go
Signals: N/A
Excerpt (<=80 chars): func HandleDeleteSpace(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleDeleteSpace
```

--------------------------------------------------------------------------------

---[FILE: space_find.go]---
Location: harness-main/app/api/handler/webhook/space_find.go
Signals: N/A
Excerpt (<=80 chars): func HandleFindSpace(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFindSpace
```

--------------------------------------------------------------------------------

---[FILE: space_find_execution.go]---
Location: harness-main/app/api/handler/webhook/space_find_execution.go
Signals: N/A
Excerpt (<=80 chars): func HandleFindExecutionSpace(webhookCtrl *webhook.Controller) http.HandlerFu...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleFindExecutionSpace
```

--------------------------------------------------------------------------------

---[FILE: space_list.go]---
Location: harness-main/app/api/handler/webhook/space_list.go
Signals: N/A
Excerpt (<=80 chars): func HandleListSpace(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListSpace
```

--------------------------------------------------------------------------------

---[FILE: space_list_executions.go]---
Location: harness-main/app/api/handler/webhook/space_list_executions.go
Signals: N/A
Excerpt (<=80 chars): func HandleListExecutionsSpace(webhookCtrl *webhook.Controller) http.HandlerF...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleListExecutionsSpace
```

--------------------------------------------------------------------------------

---[FILE: space_retrigger_execution.go]---
Location: harness-main/app/api/handler/webhook/space_retrigger_execution.go
Signals: N/A
Excerpt (<=80 chars): func HandleRetriggerExecutionSpace(webhookCtrl *webhook.Controller) http.Hand...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleRetriggerExecutionSpace
```

--------------------------------------------------------------------------------

---[FILE: space_update.go]---
Location: harness-main/app/api/handler/webhook/space_update.go
Signals: N/A
Excerpt (<=80 chars): func HandleUpdateSpace(webhookCtrl *webhook.Controller) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HandleUpdateSpace
```

--------------------------------------------------------------------------------

---[FILE: address.go]---
Location: harness-main/app/api/middleware/address/address.go
Signals: N/A
Excerpt (<=80 chars): func Handler(scheme, host string) func(http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handler
- resolveScheme
- resolveHost
```

--------------------------------------------------------------------------------

---[FILE: authn.go]---
Location: harness-main/app/api/middleware/authn/authn.go
Signals: N/A
Excerpt (<=80 chars): func Attempt(authenticator authn.Authenticator) func(http.Handler) http.Handl...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Attempt
```

--------------------------------------------------------------------------------

---[FILE: authz.go]---
Location: harness-main/app/api/middleware/authz/authz.go
Signals: N/A
Excerpt (<=80 chars): func BlockSessionToken(next http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlockSessionToken
```

--------------------------------------------------------------------------------

---[FILE: encode.go]---
Location: harness-main/app/api/middleware/encode/encode.go
Signals: N/A
Excerpt (<=80 chars): func GitPathBefore(next http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitPathBefore
- processGitRequest
- TerminatedPathBefore
- TerminatedRegexPathBefore
- pathTerminatedWithMarker
- pathTerminatedWithMarkerAndURL
- regexPathTerminatedWithMarker
- cutOutTerminatedPath
```

--------------------------------------------------------------------------------

---[FILE: encode_test.go]---
Location: harness-main/app/api/middleware/encode/encode_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestTerminatedPathBefore(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestTerminatedPathBefore
- TestCutOutTerminatedPath
- TestRegexPathTerminatedWithMarker
```

--------------------------------------------------------------------------------

---[FILE: goget.go]---
Location: harness-main/app/api/middleware/goget/goget.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- Middleware
```

--------------------------------------------------------------------------------

---[FILE: logging.go]---
Location: harness-main/app/api/middleware/logging/logging.go
Signals: N/A
Excerpt (<=80 chars): func HLogRequestIDHandler() func(http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HLogRequestIDHandler
- HLogAccessLogHandler
- URLHandler
```

--------------------------------------------------------------------------------

---[FILE: nocache.go]---
Location: harness-main/app/api/middleware/nocache/nocache.go
Signals: N/A
Excerpt (<=80 chars): func NoCache(h http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoCache
```

--------------------------------------------------------------------------------

---[FILE: nocache_test.go]---
Location: harness-main/app/api/middleware/nocache/nocache_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestNoCache(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNoCache
- TestNoCachePreservesETag
- TestNoCacheWithMultipleRequests
- TestNoCacheHeaderValues
- contains
```

--------------------------------------------------------------------------------

---[FILE: principal.go]---
Location: harness-main/app/api/middleware/principal/principal.go
Signals: N/A
Excerpt (<=80 chars): func RestrictTo(pType enum.PrincipalType) func(http.Handler) http.Handler {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestrictTo
- RestrictToAdmin
- GitHookRestrict
```

--------------------------------------------------------------------------------

---[FILE: public_access.go]---
Location: harness-main/app/api/middleware/web/public_access.go
Signals: N/A
Excerpt (<=80 chars): func PublicAccess(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicAccess
```

--------------------------------------------------------------------------------

---[FILE: account.go]---
Location: harness-main/app/api/openapi/account.go
Signals: N/A
Excerpt (<=80 chars): type loginRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loginRequest
- registerRequest
- buildAccount
```

--------------------------------------------------------------------------------

---[FILE: check.go]---
Location: harness-main/app/api/openapi/check.go
Signals: N/A
Excerpt (<=80 chars):  func checkOperations(reflector *openapi3.Reflector) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkOperations
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/app/api/openapi/common.go
Signals: N/A
Excerpt (<=80 chars):  func ptrSchemaType(t openapi3.SchemaType) *openapi3.SchemaType {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ptrSchemaType
- ptrptr
```

--------------------------------------------------------------------------------

---[FILE: connector.go]---
Location: harness-main/app/api/openapi/connector.go
Signals: N/A
Excerpt (<=80 chars):  type createConnectorRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createConnectorRequest
- connectorRequest
- getConnectorRequest
- updateConnectorRequest
- connectorOperations
```

--------------------------------------------------------------------------------

---[FILE: gitspace.go]---
Location: harness-main/app/api/openapi/gitspace.go
Signals: N/A
Excerpt (<=80 chars):  type createGitspaceRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createGitspaceRequest
- lookupRepoGitspaceRequest
- actionGitspaceRequest
- updateGitspaceRequest
- gitspaceRequest
- getGitspaceRequest
- gitspacesListRequest
- gitspaceEventsListRequest
- gitspacesListAllRequest
- gitspaceOperations
```

--------------------------------------------------------------------------------

---[FILE: infra_provider.go]---
Location: harness-main/app/api/openapi/infra_provider.go
Signals: N/A
Excerpt (<=80 chars):  type createInfraProviderConfigRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createInfraProviderConfigRequest
- getInfraProviderRequest
- infraProviderOperations
```

--------------------------------------------------------------------------------

---[FILE: openapi.go]---
Location: harness-main/app/api/openapi/openapi.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAPI
- NewOpenAPIService
- Generate
- panicOnErr
```

--------------------------------------------------------------------------------

---[FILE: pipeline.go]---
Location: harness-main/app/api/openapi/pipeline.go
Signals: N/A
Excerpt (<=80 chars):  type pipelineRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pipelineRequest
- executionRequest
- triggerRequest
- logRequest
- createExecutionRequest
- createTriggerRequest
- createPipelineRequest
- getExecutionRequest
- getTriggerRequest
- getPipelineRequest
- updateTriggerRequest
- updatePipelineRequest
- pipelineOperations
```

--------------------------------------------------------------------------------

---[FILE: plugin.go]---
Location: harness-main/app/api/openapi/plugin.go
Signals: N/A
Excerpt (<=80 chars):  type getPluginsRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getPluginsRequest
- pluginOperations
```

--------------------------------------------------------------------------------

---[FILE: principals.go]---
Location: harness-main/app/api/openapi/principals.go
Signals: N/A
Excerpt (<=80 chars):  type principalInfoRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- principalInfoRequest
- buildPrincipals
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/app/api/openapi/pullreq.go
Signals: N/A
Excerpt (<=80 chars):  type createPullReqRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createPullReqRequest
- listPullReqRequest
- pullReqRequest
- getPullReqRequest
- getPullReqByBranchesRequest
- updatePullReqRequest
- statePullReqRequest
- listPullReqActivitiesRequest
- userGroupReviewerAddRequest
- userGroupReviewerDeleteRequest
- mergePullReq
- commentCreatePullReqRequest
- commentApplySuggestionstRequest
- pullReqCommentRequest
- commentUpdatePullReqRequest
- commentDeletePullReqRequest
- commentStatusPullReqRequest
- reviewerListPullReqRequest
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/app/api/openapi/repo.go
Signals: N/A
Excerpt (<=80 chars):  type createRepositoryRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRepositoryRequest
- gitignoreRequest
- licenseRequest
- repoRequest
- updateRepoRequest
- updateDefaultBranchRequest
- moveRepoRequest
- getContentRequest
- pathsDetailsRequest
- getBlameRequest
- commitFilesRequest
- contentInfo
- dirContent
- content
- getContentOutput
- listCommitsRequest
- GetCommitRequest
- GetCommitDiffRequest
```

--------------------------------------------------------------------------------

---[FILE: resource.go]---
Location: harness-main/app/api/openapi/resource.go
Signals: N/A
Excerpt (<=80 chars):  func resourceOperations(reflector *openapi3.Reflector) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resourceOperations
```

--------------------------------------------------------------------------------

---[FILE: rules.go]---
Location: harness-main/app/api/openapi/rules.go
Signals: N/A
Excerpt (<=80 chars): type RuleType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleDefinition
- Rule
- Enum
- JSONSchemaOneOf
- rulesOperations
```

--------------------------------------------------------------------------------

---[FILE: secret.go]---
Location: harness-main/app/api/openapi/secret.go
Signals: N/A
Excerpt (<=80 chars):  type createSecretRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createSecretRequest
- secretRequest
- getSecretRequest
- updateSecretRequest
- secretOperations
```

--------------------------------------------------------------------------------

---[FILE: space.go]---
Location: harness-main/app/api/openapi/space.go
Signals: N/A
Excerpt (<=80 chars):  type createSpaceRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createSpaceRequest
- spaceRequest
- updateSpaceRequest
- updateSpacePublicAccessRequest
- moveSpaceRequest
- exportSpaceRequest
- restoreSpaceRequest
- importRepositoriesRequest
- spaceOperations
```

--------------------------------------------------------------------------------

---[FILE: system.go]---
Location: harness-main/app/api/openapi/system.go
Signals: N/A
Excerpt (<=80 chars): func buildSystem(reflector *openapi3.Reflector) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildSystem
```

--------------------------------------------------------------------------------

---[FILE: template.go]---
Location: harness-main/app/api/openapi/template.go
Signals: N/A
Excerpt (<=80 chars):  type createTemplateRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTemplateRequest
- templateRequest
- getTemplateRequest
- updateTemplateRequest
- templateOperations
```

--------------------------------------------------------------------------------

---[FILE: upload.go]---
Location: harness-main/app/api/openapi/upload.go
Signals: N/A
Excerpt (<=80 chars):  func uploadOperations(reflector *openapi3.Reflector) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- uploadOperations
```

--------------------------------------------------------------------------------

---[FILE: user.go]---
Location: harness-main/app/api/openapi/user.go
Signals: N/A
Excerpt (<=80 chars):  type tokensRequest struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tokensRequest
- favoriteRequest
- buildUser
```

--------------------------------------------------------------------------------

---[FILE: users.go]---
Location: harness-main/app/api/openapi/users.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildAdmin
```

--------------------------------------------------------------------------------

---[FILE: webhook.go]---
Location: harness-main/app/api/openapi/webhook.go
Signals: N/A
Excerpt (<=80 chars): type webhookType struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhookType
- createSpaceWebhookRequest
- createRepoWebhookRequest
- listSpaceWebhooksRequest
- listRepoWebhooksRequest
- spaceWebhookRequest
- repoWebhookRequest
- getSpaceWebhookRequest
- getRepoWebhookRequest
- deleteSpaceWebhookRequest
- deleteRepoWebhookRequest
- updateSpaceWebhookRequest
- updateRepoWebhookRequest
- listSpaceWebhookExecutionsRequest
- listRepoWebhookExecutionsRequest
- spaceWebhookExecutionRequest
- repoWebhookExecutionRequest
- getSpaceWebhookExecutionRequest
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/api/openapi/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideOpenAPIService() Service {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideOpenAPIService
```

--------------------------------------------------------------------------------

---[FILE: header.go]---
Location: harness-main/app/api/render/header.go
Signals: N/A
Excerpt (<=80 chars): func Pagination(r *http.Request, w http.ResponseWriter, page, size, total int) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
- PaginationNoTotal
- PaginationLimit
- getPaginationBaseURL
- NoCache
```

--------------------------------------------------------------------------------

---[FILE: render.go]---
Location: harness-main/app/api/render/render.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- DeleteSuccessful
- JSON
- Reader
- Unprocessable
- Violations
- GitBasicAuth
- setCommonHeaders
- writeJSON
```

--------------------------------------------------------------------------------

````
