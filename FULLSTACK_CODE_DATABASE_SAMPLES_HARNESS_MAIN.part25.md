---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 25
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 25 of 37)

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

---[FILE: devcontainer_config.go]---
Location: harness-main/types/devcontainer_config.go
Signals: N/A
Excerpt (<=80 chars): type DevcontainerConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DevcontainerConfig
- LifecycleCommand
- FeatureValue
- Mount
- UnmarshalJSON
- MarshalJSON
- ToCommandArray
- validateFeatureSource
- validateTarballURL
- ParseMountsFromRawSlice
- ParseMountsFromStringSlice
- stringToObject
```

--------------------------------------------------------------------------------

---[FILE: devcontainer_config_customizations.go]---
Location: harness-main/types/devcontainer_config_customizations.go
Signals: N/A
Excerpt (<=80 chars):  type CustomizationsKey string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VSCodeCustomizationSpecs
- GitspaceCustomizationSpecs
- JetBrainsCustomizationSpecs
- String
- Valid
- IdeType
- ExtractGitspaceSpec
- ExtractVSCodeSpec
- ExtractJetBrainsSpecs
```

--------------------------------------------------------------------------------

---[FILE: devcontainer_feature_config.go]---
Location: harness-main/types/devcontainer_feature_config.go
Signals: N/A
Excerpt (<=80 chars): type DevcontainerFeatureConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DevcontainerFeatureConfig
- OptionDefinition
- ValidateValue
```

--------------------------------------------------------------------------------

---[FILE: execution.go]---
Location: harness-main/types/execution.go
Signals: N/A
Excerpt (<=80 chars): type ListExecutionsFilter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListExecutionsFilter
- Execution
- ExecutionInfo
```

--------------------------------------------------------------------------------

---[FILE: favorite.go]---
Location: harness-main/types/favorite.go
Signals: N/A
Excerpt (<=80 chars):  type FavoriteResource struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FavoriteResource
```

--------------------------------------------------------------------------------

---[FILE: fork.go]---
Location: harness-main/types/fork.go
Signals: N/A
Excerpt (<=80 chars):  type ForkSyncOutput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ForkSyncOutput
```

--------------------------------------------------------------------------------

---[FILE: git.go]---
Location: harness-main/types/git.go
Signals: N/A
Excerpt (<=80 chars): type PaginationFilter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PaginationFilter
- CommitFilter
- BranchMetadataOptions
- BranchFilter
- TagFilter
- ChangeStats
- CommitFileStats
- CommitStats
- Commit
- CommitTag
- Signature
- Identity
- SignedData
- RenameDetails
- ListCommitResponse
- GitSignatureResult
- GetSHA
- SetSignature
```

--------------------------------------------------------------------------------

---[FILE: githook.go]---
Location: harness-main/types/githook.go
Signals: N/A
Excerpt (<=80 chars): type GithookInputBase struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GithookInputBase
- GithookPreReceiveInput
- GithookUpdateInput
- GithookPostReceiveInput
```

--------------------------------------------------------------------------------

---[FILE: github_connector_data.go]---
Location: harness-main/types/github_connector_data.go
Signals: N/A
Excerpt (<=80 chars):  type GithubConnectorData struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GithubConnectorData
- Validate
- Type
```

--------------------------------------------------------------------------------

---[FILE: gitspace.go]---
Location: harness-main/types/gitspace.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitspaceConfig
- CodeRepo
- GitspaceUser
- GitspaceInstance
- GitspaceFilter
- ScopeFilter
- GitspaceInstanceFilter
- GetGitspaceState
```

--------------------------------------------------------------------------------

---[FILE: gitspace_error.go]---
Location: harness-main/types/gitspace_error.go
Signals: N/A
Excerpt (<=80 chars): type GitspaceError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitspaceError
```

--------------------------------------------------------------------------------

---[FILE: gitspace_event.go]---
Location: harness-main/types/gitspace_event.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceEvent struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitspaceEvent
- GitspaceEventResponse
- GitspaceEventFilter
```

--------------------------------------------------------------------------------

---[FILE: gitspace_port.go]---
Location: harness-main/types/gitspace_port.go
Signals: N/A
Excerpt (<=80 chars):  type GitspacePort struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitspacePort
```

--------------------------------------------------------------------------------

---[FILE: gitspace_run_arg.go]---
Location: harness-main/types/gitspace_run_arg.go
Signals: N/A
Excerpt (<=80 chars):  type RunArg string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RunArgDefinition
- RunArgValue
- String
```

--------------------------------------------------------------------------------

---[FILE: gitspace_settings.go]---
Location: harness-main/types/gitspace_settings.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceSettingsFilter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitspaceSettingsFilter
- SettingsData
- GitspaceSettings
- IDESettings
- SCMProviderSettings
- DevcontainerSettings
- DevcontainerImage
- GitspaceConfigSettings
- InfraProviderSettings
- flattenCriteria
- flattenCriteriaWithDepth
- ToKey
- IsAllowed
- Remove
- ValidateAndDecodeSettings
```

--------------------------------------------------------------------------------

---[FILE: ide.go]---
Location: harness-main/types/ide.go
Signals: N/A
Excerpt (<=80 chars):  type IDEDownloadURLs struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDEDownloadURLs
```

--------------------------------------------------------------------------------

---[FILE: image_data.go]---
Location: harness-main/types/image_data.go
Signals: N/A
Excerpt (<=80 chars):  type ImageData struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImageData
```

--------------------------------------------------------------------------------

---[FILE: infrastructure.go]---
Location: harness-main/types/infrastructure.go
Signals: N/A
Excerpt (<=80 chars):  type InfraProviderParameterSchema struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfraProviderParameterSchema
- InfraProviderParameter
- PortMapping
- InstanceInfo
- Infrastructure
```

--------------------------------------------------------------------------------

---[FILE: infra_provider.go]---
Location: harness-main/types/infra_provider.go
Signals: N/A
Excerpt (<=80 chars):  type InfraProviderConfig struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfraProviderConfig
- InfraProviderResource
- InfraProviderTemplate
- InfraProviderConfigFilter
- Identifier
- validateInfraProviderResource
- validateBytes
- withoutSpace
- validateCPU
- CompareInfraProviderResource
```

--------------------------------------------------------------------------------

---[FILE: infra_provisioned.go]---
Location: harness-main/types/infra_provisioned.go
Signals: N/A
Excerpt (<=80 chars):  type InfraProvisioned struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfraProvisioned
- InfraProvisionedGatewayView
- InfraProvisionedUpdateGatewayRequest
```

--------------------------------------------------------------------------------

---[FILE: jetbrains.go]---
Location: harness-main/types/jetbrains.go
Signals: N/A
Excerpt (<=80 chars):  type JetBrainsIDEDownloadURLTemplates struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JetBrainsIDEDownloadURLTemplates
- JetBrainsSpecs
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/types/label.go
Signals: N/A
Excerpt (<=80 chars):  type Label struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Label
- LabelValue
- LabelWithValues
- PullReqLabel
- LabelInfo
- LabelValueInfo
- LabelAssignment
- LabelPullReqAssignmentInfo
- ScopeData
- ScopesLabels
- AssignableLabelFilter
- LabelFilter
- DefineLabelInput
- UpdateLabelInput
- DefineValueInput
- UpdateValueInput
- PullReqLabelAssignInput
- PullReqUpdateInput
```

--------------------------------------------------------------------------------

---[FILE: lfs.go]---
Location: harness-main/types/lfs.go
Signals: N/A
Excerpt (<=80 chars):  type LFSObject struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LFSObject
- LFSLock
```

--------------------------------------------------------------------------------

---[FILE: list_filters.go]---
Location: harness-main/types/list_filters.go
Signals: N/A
Excerpt (<=80 chars): type ListQueryFilter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListQueryFilter
- CreatedFilter
- UpdatedFilter
- EditedFilter
```

--------------------------------------------------------------------------------

---[FILE: mask_secret.go]---
Location: harness-main/types/mask_secret.go
Signals: N/A
Excerpt (<=80 chars): type MaskSecret struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MaskSecret
- NewMaskSecret
- Value
- String
- MarshalJSON
- UnmarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: membership.go]---
Location: harness-main/types/membership.go
Signals: N/A
Excerpt (<=80 chars): type MembershipKey struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MembershipKey
- Membership
- MembershipUser
- MembershipUserFilter
- MembershipSpace
- MembershipSpaceFilter
```

--------------------------------------------------------------------------------

---[FILE: multireader_closer.go]---
Location: harness-main/types/multireader_closer.go
Signals: N/A
Excerpt (<=80 chars):  type MultiReadCloser struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MultiReadCloser
- Close
```

--------------------------------------------------------------------------------

---[FILE: multireader_closer_test.go]---
Location: harness-main/types/multireader_closer_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestMultiReadCloser_Read(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestMultiReadCloser_Read
- TestMultiReadCloser_Close
- TestMultiReadCloser_CloseError
- TestMultiReadCloser_ReadAndClose
- TestMultiReadCloser_MultipleReads
- TestMultiReadCloser_EOF
- TestMultiReadCloser_NilCloseFunc
- TestMultiReadCloser_EmptyReader
- TestMultiReadCloser_MultipleCloses
```

--------------------------------------------------------------------------------

---[FILE: PackageTag.go]---
Location: harness-main/types/PackageTag.go
Signals: N/A
Excerpt (<=80 chars):  type PackageTag struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageTag
```

--------------------------------------------------------------------------------

---[FILE: pagination.go]---
Location: harness-main/types/pagination.go
Signals: N/A
Excerpt (<=80 chars): type Pagination struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
```

--------------------------------------------------------------------------------

---[FILE: path.go]---
Location: harness-main/types/path.go
Signals: N/A
Excerpt (<=80 chars): type SpacePath struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpacePath
- SpacePathSegment
- MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: path_test.go]---
Location: harness-main/types/path_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestSpacePathSegment_MarshalJSON(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestSpacePathSegment_MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: pipeline.go]---
Location: harness-main/types/pipeline.go
Signals: N/A
Excerpt (<=80 chars):  type Pipeline struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pipeline
- ListPipelinesFilter
- MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: platform_connector.go]---
Location: harness-main/types/platform_connector.go
Signals: N/A
Excerpt (<=80 chars):  type PlatformConnectorType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PlatformConnector
- PlatformConnectorSpec
- AwsCredentials
- PlatformConnectorAuthSpec
- String
- ToPlatformConnectorType
- ToPlatformConnectorAuthType
- ToAwsCredentialsType
- ExtractRegistryURL
- ExtractRegistryUserName
- ExtractUserNameRef
- ExtractPasswordRef
- ExtractRegistryAuth
```

--------------------------------------------------------------------------------

---[FILE: plugin.go]---
Location: harness-main/types/plugin.go
Signals: N/A
Excerpt (<=80 chars): type Plugin struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Plugin
- Matches
- MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: principal.go]---
Location: harness-main/types/principal.go
Signals: N/A
Excerpt (<=80 chars): type Principal struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Principal
- PrincipalInfo
- PrincipalFilter
- IsAnonymous
- ToPrincipalInfo
- Identifier
```

--------------------------------------------------------------------------------

---[FILE: public_key.go]---
Location: harness-main/types/public_key.go
Signals: N/A
Excerpt (<=80 chars):  type PublicKey struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicKey
- PublicKeyFilter
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/types/pullreq.go
Signals: N/A
Excerpt (<=80 chars): type PullReq struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReq
- DiffStats
- PullReqStats
- PullReqFilter
- PullReqMetadataOptions
- PullReqReview
- PullReqReviewer
- UserGroupReviewer
- ReviewerEvaluation
- PullReqFileView
- DefaultReviewerApprovalsResponse
- MergeResponse
- MergeViolations
- PullReqRepo
- RevertResponse
- UpdateMergeOutcome
- MarkAsMergeUnchecked
- MarkAsMergeable
```

--------------------------------------------------------------------------------

---[FILE: pullreq_activity.go]---
Location: harness-main/types/pullreq_activity.go
Signals: N/A
Excerpt (<=80 chars): type PullReqActivity struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqActivity
- PullReqActivityFilter
- IsValidCodeComment
- AsCodeComment
- IsReplyable
- IsReply
- IsBlocking
- SetPayload
- GetPayload
- UpdateMetadata
```

--------------------------------------------------------------------------------

---[FILE: pullreq_activity_metadata.go]---
Location: harness-main/types/pullreq_activity_metadata.go
Signals: N/A
Excerpt (<=80 chars): type PullReqActivityMetadata struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqActivityMetadata
- PullReqActivityMetadataUpdate
- PullReqActivitySuggestionsMetadata
- PullReqActivityMentionsMetadata
- IsEmpty
- apply
- WithPullReqActivityMetadataUpdate
- WithPullReqActivitySuggestionsMetadataUpdate
- WithPullReqActivityMentionsMetadataUpdate
```

--------------------------------------------------------------------------------

---[FILE: pullreq_activity_payload.go]---
Location: harness-main/types/pullreq_activity_payload.go
Signals: N/A
Excerpt (<=80 chars): type PullReqActivityPayload interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqActivityPayload
- PullRequestActivityPayloadComment
- PullRequestActivityPayloadCodeComment
- PullRequestActivityPayloadMerge
- PullRequestActivityPayloadStateChange
- PullRequestActivityPayloadTitleChange
- PullRequestActivityPayloadReviewSubmit
- PullRequestActivityPayloadReviewerAdd
- PullRequestActivityPayloadUserGroupReviewerAdd
- PullRequestActivityPayloadReviewerDelete
- PullRequestActivityPayloadUserGroupReviewerDelete
- PullRequestActivityPayloadBranchUpdate
- PullRequestActivityPayloadBranchDelete
- PullRequestActivityPayloadBranchRestore
- PullRequestActivityPayloadBranchChangeTarget
- PullRequestActivityLabelBase
- PullRequestActivityLabel
- PullRequestActivityLabels
```

--------------------------------------------------------------------------------

---[FILE: rebase.go]---
Location: harness-main/types/rebase.go
Signals: N/A
Excerpt (<=80 chars):  type RebaseResponse struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RebaseResponse
- SquashResponse
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/types/repo.go
Signals: N/A
Excerpt (<=80 chars):  type RepositoryCore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryCore
- Repository
- RepositorySizeInfo
- RepoFilter
- RepoCacheKey
- RepositoryPullReqSummary
- RepositorySummary
- RepositoryCount
- LinkedRepo
- GetGitUID
- Core
- Clone
- Sanitize
- sanitizeRepoTag
```

--------------------------------------------------------------------------------

---[FILE: resolved_feature.go]---
Location: harness-main/types/resolved_feature.go
Signals: N/A
Excerpt (<=80 chars):  type ResolvedFeature struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResolvedFeature
- DownloadedFeature
- Print
- CompareResolvedFeature
- compareTags
- compareOverriddenOptions
- getSortedOptions
```

--------------------------------------------------------------------------------

---[FILE: rule.go]---
Location: harness-main/types/rule.go
Signals: N/A
Excerpt (<=80 chars):  type Rule struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Rule
- RuleFilter
- Violation
- RuleViolations
- RuleInfo
- RuleInfoInternal
- RulesViolations
- DryRunRulesOutput
- RuleParentInfo
- MarshalJSON
- MarshalYAML
- Clone
- IsEqual
- Add
- Addf
- IsCritical
- IsBypassed
```

--------------------------------------------------------------------------------

---[FILE: secret.go]---
Location: harness-main/types/secret.go
Signals: N/A
Excerpt (<=80 chars):  type Secret struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Secret
- MarshalJSON
- CopyWithoutData
```

--------------------------------------------------------------------------------

---[FILE: secret_ref.go]---
Location: harness-main/types/secret_ref.go
Signals: N/A
Excerpt (<=80 chars):  type SecretRef struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecretRef
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/types/service.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToPrincipal
- ToPrincipalInfo
```

--------------------------------------------------------------------------------

---[FILE: service_account.go]---
Location: harness-main/types/service_account.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServiceAccountParentInfo
- ToPrincipal
- ToPrincipalInfo
- ToServiceAccountInfo
```

--------------------------------------------------------------------------------

---[FILE: space.go]---
Location: harness-main/types/space.go
Signals: N/A
Excerpt (<=80 chars):  type SpaceCore struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpaceCore
- Space
- SpaceParentData
- SpaceFilter
- SpaceStorage
- Core
```

--------------------------------------------------------------------------------

---[FILE: stage.go]---
Location: harness-main/types/stage.go
Signals: N/A
Excerpt (<=80 chars):  type Stage struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Stage
```

--------------------------------------------------------------------------------

---[FILE: step.go]---
Location: harness-main/types/step.go
Signals: N/A
Excerpt (<=80 chars):  type Step struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Step
- String
```

--------------------------------------------------------------------------------

---[FILE: tag.go]---
Location: harness-main/types/tag.go
Signals: N/A
Excerpt (<=80 chars):  type CreateCommitTagOutput struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCommitTagOutput
- DeleteCommitTagOutput
```

--------------------------------------------------------------------------------

---[FILE: template.go]---
Location: harness-main/types/template.go
Signals: N/A
Excerpt (<=80 chars):  type Template struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Template
- MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: token.go]---
Location: harness-main/types/token.go
Signals: N/A
Excerpt (<=80 chars): type Token struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Token
- TokenResponse
- MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: trigger.go]---
Location: harness-main/types/trigger.go
Signals: N/A
Excerpt (<=80 chars):  type Trigger struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Trigger
- MarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: usage_metric.go]---
Location: harness-main/types/usage_metric.go
Signals: N/A
Excerpt (<=80 chars):  type UsageMetric struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsageMetric
```

--------------------------------------------------------------------------------

---[FILE: user.go]---
Location: harness-main/types/user.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToPrincipal
- ToPrincipalInfo
```

--------------------------------------------------------------------------------

---[FILE: usergroup.go]---
Location: harness-main/types/usergroup.go
Signals: N/A
Excerpt (<=80 chars):  type UserGroup struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserGroup
- UserGroupInfo
- ToUserGroupInfo
```

--------------------------------------------------------------------------------

---[FILE: webhook.go]---
Location: harness-main/types/webhook.go
Signals: N/A
Excerpt (<=80 chars): type Webhook struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Webhook
- WebhookCreateInput
- WebhookSignatureMetadata
- WebhookUpdateInput
- WebhookExecution
- WebhookExecutionRequest
- WebhookExecutionResponse
- WebhookFilter
- WebhookExecutionFilter
- WebhookParentInfo
- WebhookCore
- WebhookExecutionCore
- ExtraHeader
- MarshalJSON
- Clone
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/types/check/common.go
Signals: N/A
Excerpt (<=80 chars): func DisplayName(displayName string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisplayName
- Description
- ForControlCharacters
- Identifier
- RepoIdentifierDefault
- PrincipalUIDDefault
- SpaceIdentifierDefault
- Email
```

--------------------------------------------------------------------------------

---[FILE: error.go]---
Location: harness-main/types/check/error.go
Signals: N/A
Excerpt (<=80 chars): type ValidationError struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidationError
- NewValidationError
- NewValidationErrorf
- Error
- Is
```

--------------------------------------------------------------------------------

---[FILE: password.go]---
Location: harness-main/types/check/password.go
Signals: N/A
Excerpt (<=80 chars): func Password(pw string) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Password
```

--------------------------------------------------------------------------------

---[FILE: path.go]---
Location: harness-main/types/check/path.go
Signals: N/A
Excerpt (<=80 chars): func Path(path string, isSpace bool, identifierCheck SpaceIdentifier) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Path
- PathDepth
- IsPathTooDeep
```

--------------------------------------------------------------------------------

---[FILE: service_account.go]---
Location: harness-main/types/check/service_account.go
Signals: N/A
Excerpt (<=80 chars): func ServiceAccountParent(parentType enum.ParentResourceType, parentID int64)...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServiceAccountParent
```

--------------------------------------------------------------------------------

---[FILE: token.go]---
Location: harness-main/types/check/token.go
Signals: N/A
Excerpt (<=80 chars): func TokenLifetime(lifetime *time.Duration, optional bool) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TokenLifetime
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/types/check/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideSpaceIdentifierCheck() SpaceIdentifier {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideSpaceIdentifierCheck
- ProvidePrincipalUIDCheck
- ProvideRepoIdentifierCheck
```

--------------------------------------------------------------------------------

---[FILE: ai_agent.go]---
Location: harness-main/types/enum/ai_agent.go
Signals: N/A
Excerpt (<=80 chars):  type AIAgent string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- String
- UnmarshalJSON
- Sanitize
- GetAllAIAgents
```

--------------------------------------------------------------------------------

---[FILE: ai_agent_auth.go]---
Location: harness-main/types/enum/ai_agent_auth.go
Signals: N/A
Excerpt (<=80 chars):  type AIAgentAuth string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- String
- UnmarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: ai_task_event.go]---
Location: harness-main/types/enum/ai_task_event.go
Signals: N/A
Excerpt (<=80 chars):  type AITaskEvent string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: ai_task_state.go]---
Location: harness-main/types/enum/ai_task_state.go
Signals: N/A
Excerpt (<=80 chars):  type AITaskState string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- IsFinalStatus
- IsActiveStatus
- Sanitize
- GetAllAITaskState
```

--------------------------------------------------------------------------------

---[FILE: check.go]---
Location: harness-main/types/enum/check.go
Signals: N/A
Excerpt (<=80 chars): type CheckStatus string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllCheckStatuses
- GetAllCheckPayloadTypes
- IsCompleted
- IsSuccess
```

--------------------------------------------------------------------------------

---[FILE: ci_status.go]---
Location: harness-main/types/enum/ci_status.go
Signals: N/A
Excerpt (<=80 chars): type CIStatus string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllCIStatuses
- ConvertToCheckStatus
- ParseCIStatus
- IsDone
- IsFailed
```

--------------------------------------------------------------------------------

---[FILE: codeowner_violation.go]---
Location: harness-main/types/enum/codeowner_violation.go
Signals: N/A
Excerpt (<=80 chars):  type CodeOwnerViolationCode string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: common_test.go]---
Location: harness-main/types/enum/common_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestSanitizeString(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestSanitizeString
- TestSanitizeInt
- TestSanitizeFloat64
- TestSanitizeEmptySlice
- TestSanitizeEmptyDefault
- TestSanitizeWithOrder
- TestToInterfaceSlice
- TestSortEnum
- BenchmarkSanitizeString
- BenchmarkSanitizeInt
- BenchmarkToInterfaceSlice
- BenchmarkSortEnum
```

--------------------------------------------------------------------------------

---[FILE: communication_protocol.go]---
Location: harness-main/types/enum/communication_protocol.go
Signals: N/A
Excerpt (<=80 chars):  type CommunicationProtocol string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: connector_auth_type.go]---
Location: harness-main/types/enum/connector_auth_type.go
Signals: N/A
Excerpt (<=80 chars): type ConnectorAuthType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseConnectorAuthType
- String
- GetAllConnectorAuthTypes
- Enum
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: connector_status.go]---
Location: harness-main/types/enum/connector_status.go
Signals: N/A
Excerpt (<=80 chars): type ConnectorStatus string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- String
- GetAllConnectorStatus
- Enum
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: connector_type.go]---
Location: harness-main/types/enum/connector_type.go
Signals: N/A
Excerpt (<=80 chars): type ConnectorType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseConnectorType
- String
- IsSCM
- GetAllConnectorTypes
- Enum
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: encoding.go]---
Location: harness-main/types/enum/encoding.go
Signals: N/A
Excerpt (<=80 chars): type ContentEncodingType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: encoding_test.go]---
Location: harness-main/types/enum/encoding_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestContentEncodingTypeConstants(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestContentEncodingTypeConstants
- TestContentEncodingTypeString
- TestContentEncodingTypeEnum
- TestContentEncodingTypeEnumSorted
- TestContentEncodingTypeComparison
- TestContentEncodingTypeZeroValue
- TestContentEncodingTypeConversion
- TestContentEncodingTypeValidation
- TestContentEncodingTypeInvalidValues
- BenchmarkContentEncodingTypeString
- BenchmarkContentEncodingTypeEnum
- BenchmarkContentEncodingTypeComparison
```

--------------------------------------------------------------------------------

---[FILE: execution.go]---
Location: harness-main/types/enum/execution.go
Signals: N/A
Excerpt (<=80 chars): type ExecutionSort string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllExecutionSorts
```

--------------------------------------------------------------------------------

---[FILE: feature_option_value_type.go]---
Location: harness-main/types/enum/feature_option_value_type.go
Signals: N/A
Excerpt (<=80 chars):  type FeatureOptionValueType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: feature_source_type.go]---
Location: harness-main/types/enum/feature_source_type.go
Signals: N/A
Excerpt (<=80 chars):  type FeatureSourceType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: git.go]---
Location: harness-main/types/enum/git.go
Signals: N/A
Excerpt (<=80 chars): type BranchSortOption int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseBranchSortOption
- String
- ParseTagSortOption
- ParseGitServiceType
```

--------------------------------------------------------------------------------

---[FILE: gitspace.go]---
Location: harness-main/types/enum/gitspace.go
Signals: N/A
Excerpt (<=80 chars): type GitspaceSort string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- ParseGitspaceSort
- ParseGitspaceOwner
- Sanitize
- GetAllGitspaceFilterState
```

--------------------------------------------------------------------------------

---[FILE: gitspace_access_type.go]---
Location: harness-main/types/enum/gitspace_access_type.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceAccessType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: gitspace_action_type.go]---
Location: harness-main/types/enum/gitspace_action_type.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceActionType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: gitspace_code_repo_type.go]---
Location: harness-main/types/enum/gitspace_code_repo_type.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceCodeRepoType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- IsOnPrem
- UnmarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: gitspace_entity_type.go]---
Location: harness-main/types/enum/gitspace_entity_type.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceEntityType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: gitspace_event_type.go]---
Location: harness-main/types/enum/gitspace_event_type.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceEventType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- EventsMessageMapping
```

--------------------------------------------------------------------------------

---[FILE: gitspace_instance_state_type.go]---
Location: harness-main/types/enum/gitspace_instance_state_type.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceInstanceStateType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- IsFinalStatus
- IsBusyStatus
```

--------------------------------------------------------------------------------

---[FILE: gitspace_operations_event.go]---
Location: harness-main/types/enum/gitspace_operations_event.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceOperationsEvent string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: gitspace_settings.go]---
Location: harness-main/types/enum/gitspace_settings.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceSettingsType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: gitspace_state_type.go]---
Location: harness-main/types/enum/gitspace_state_type.go
Signals: N/A
Excerpt (<=80 chars):  type GitspaceStateType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: git_lfs.go]---
Location: harness-main/types/enum/git_lfs.go
Signals: N/A
Excerpt (<=80 chars):  type GitLFSTransferType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseGitLFSTransferType
- ParseGitLFSOperationType
- ParseGitLFSServiceType
```

--------------------------------------------------------------------------------

---[FILE: ide.go]---
Location: harness-main/types/enum/ide.go
Signals: N/A
Excerpt (<=80 chars):  type IDEType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- String
- IsJetBrainsIDE
- UnmarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: infra_event.go]---
Location: harness-main/types/enum/infra_event.go
Signals: N/A
Excerpt (<=80 chars):  type InfraEvent string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: infra_provider_type.go]---
Location: harness-main/types/enum/infra_provider_type.go
Signals: N/A
Excerpt (<=80 chars):  type InfraProviderType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- AllInfraProviderTypes
- UnmarshalJSON
```

--------------------------------------------------------------------------------

---[FILE: infra_status.go]---
Location: harness-main/types/enum/infra_status.go
Signals: N/A
Excerpt (<=80 chars):  type InfraStatus string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: job.go]---
Location: harness-main/types/enum/job.go
Signals: N/A
Excerpt (<=80 chars): type JobState string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllJobStates
- IsCompleted
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/types/enum/label.go
Signals: N/A
Excerpt (<=80 chars):  type LabelType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllLabelTypes
- GetAllLabelColors
```

--------------------------------------------------------------------------------

---[FILE: membership.go]---
Location: harness-main/types/enum/membership.go
Signals: N/A
Excerpt (<=80 chars): type MembershipUserSort string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllMembershipUserSorts
- ParseMembershipUserSort
- String
- GetAllMembershipSpaceSorts
- ParseMembershipSpaceSort
```

--------------------------------------------------------------------------------

````
