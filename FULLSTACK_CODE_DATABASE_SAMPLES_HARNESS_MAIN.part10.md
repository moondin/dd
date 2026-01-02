---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 10
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 10 of 37)

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

---[FILE: job_link.go]---
Location: harness-main/app/services/importer/job_link.go
Signals: N/A
Excerpt (<=80 chars):  type JobRepositoryLink struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobRepositoryLink
- JobLinkRepoInput
- NewJobRepositoryLink
- Register
- Run
- jobIDFromRepoID
- getJobDef
- getJobInput
- Handle
```

--------------------------------------------------------------------------------

---[FILE: job_reference_sync.go]---
Location: harness-main/app/services/importer/job_reference_sync.go
Signals: N/A
Excerpt (<=80 chars):  type JobReferenceSync struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobReferenceSync
- ReferenceSyncInput
- Register
- Run
- getJobDef
- getJobInput
- Handle
- createRPCWriteParams
```

--------------------------------------------------------------------------------

---[FILE: job_repository.go]---
Location: harness-main/app/services/importer/job_repository.go
Signals: N/A
Excerpt (<=80 chars):  type JobRepository struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobRepository
- RepositoryInput
- Register
- Run
- RunMany
- jobIDFromRepoID
- getJobDef
- getJobInput
- Handle
- GetProgress
- Cancel
```

--------------------------------------------------------------------------------

---[FILE: job_sync_linked_repositories.go]---
Location: harness-main/app/services/importer/job_sync_linked_repositories.go
Signals: N/A
Excerpt (<=80 chars):  func CreateAndRegisterJobSyncLinkedRepositories(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobSyncLinkedRepositories
- JobLinkedRepositoriesSyncInput
- CreateAndRegisterJobSyncLinkedRepositories
- NewJobSyncLinkedRepositories
- Handle
- createRPCWriteParams
```

--------------------------------------------------------------------------------

---[FILE: provider.go]---
Location: harness-main/app/services/importer/provider.go
Signals: N/A
Excerpt (<=80 chars):  type ProviderType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Provider
- RepositoryInfo
- Enum
- ToRepo
- hash
- oauthTransport
- authHeaderTransport
- basicAuthTransport
- getScmClientWithTransport
- LoadRepositoryFromProvider
- LoadRepositoriesFromProviderSpace
- extractOrgAndProjectFromSlug
- extractRepoFromSlug
- convertSCMError
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/app/services/importer/repo.go
Signals: N/A
Excerpt (<=80 chars):  func NewRepo(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewRepo
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/importer/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideConnectorService() ConnectorService {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideConnectorService
- ProvideImporter
- ProvideJobRepositoryImport
- ProvideJobRepositoryLink
- ProvideJobReferenceSync
```

--------------------------------------------------------------------------------

---[FILE: create_config.go]---
Location: harness-main/app/services/infraprovider/create_config.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) CreateConfig(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateConfig
- areNewConfigsAllowed
- fetchExistingConfigs
- validateConfig
- updateConfig
```

--------------------------------------------------------------------------------

---[FILE: create_config_and_resources.go]---
Location: harness-main/app/services/infraprovider/create_config_and_resources.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) CreateConfigAndResources(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateConfigAndResources
```

--------------------------------------------------------------------------------

---[FILE: create_resource.go]---
Location: harness-main/app/services/infraprovider/create_resource.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) CreateResources(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateResources
- upsertResources
- updateResourceMetadata
- validateResource
- toResourceParams
- toMetadata
- getMetadataVal
- updateExistingResource
```

--------------------------------------------------------------------------------

---[FILE: create_template.go]---
Location: harness-main/app/services/infraprovider/create_template.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) CreateTemplate(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTemplate
- validateTemplates
```

--------------------------------------------------------------------------------

---[FILE: delete_all_for_spaces.go]---
Location: harness-main/app/services/infraprovider/delete_all_for_spaces.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) DeleteAllForSpaces(ctx context.Context, spaces []*types.Sp...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteAllForSpaces
```

--------------------------------------------------------------------------------

---[FILE: delete_config.go]---
Location: harness-main/app/services/infraprovider/delete_config.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) DeleteConfig(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteConfig
```

--------------------------------------------------------------------------------

---[FILE: delete_resource.go]---
Location: harness-main/app/services/infraprovider/delete_resource.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) DeleteResource(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteResource
```

--------------------------------------------------------------------------------

---[FILE: find.go]---
Location: harness-main/app/services/infraprovider/find.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) Find(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Find
- populateDetails
- getResources
- ListResources
- GetSetupYAML
- FindTemplate
- FindResourceByConfigAndIdentifier
- FindResource
```

--------------------------------------------------------------------------------

---[FILE: infraprovider.go]---
Location: harness-main/app/services/infraprovider/infraprovider.go
Signals: N/A
Excerpt (<=80 chars):  func NewService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
```

--------------------------------------------------------------------------------

---[FILE: list.go]---
Location: harness-main/app/services/infraprovider/list.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) List(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- List
```

--------------------------------------------------------------------------------

---[FILE: list_gateways.go]---
Location: harness-main/app/services/infraprovider/list_gateways.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) ListGateways(ctx context.Context, filter *types.CDEGateway...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListGateways
```

--------------------------------------------------------------------------------

---[FILE: report_stats.go]---
Location: harness-main/app/services/infraprovider/report_stats.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) ReportStats(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReportStats
```

--------------------------------------------------------------------------------

---[FILE: update_config.go]---
Location: harness-main/app/services/infraprovider/update_config.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) UpdateConfig(ctx context.Context, infraProviderConfig *typ...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateConfig
```

--------------------------------------------------------------------------------

---[FILE: update_template.go]---
Location: harness-main/app/services/infraprovider/update_template.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) UpdateTemplate(ctx context.Context, template types.InfraPr...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateTemplate
```

--------------------------------------------------------------------------------

---[FILE: upsert.go]---
Location: harness-main/app/services/infraprovider/upsert.go
Signals: N/A
Excerpt (<=80 chars):  func (c *Service) UpsertConfigAndResources(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpsertConfigAndResources
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/infraprovider/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideInfraProvider(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideInfraProvider
```

--------------------------------------------------------------------------------

---[FILE: git_consumer.go]---
Location: harness-main/app/services/instrument/git_consumer.go
Signals: N/A
Excerpt (<=80 chars):  type Consumer struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Consumer
- NewConsumer
- instrumentTrackOnBranchUpdate
```

--------------------------------------------------------------------------------

---[FILE: instrument.go]---
Location: harness-main/app/services/instrument/instrument.go
Signals: N/A
Excerpt (<=80 chars):  type CreationType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Event
- String
```

--------------------------------------------------------------------------------

---[FILE: noop.go]---
Location: harness-main/app/services/instrument/noop.go
Signals: N/A
Excerpt (<=80 chars):  type Noop struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Noop
- Track
- Close
```

--------------------------------------------------------------------------------

---[FILE: tasks.go]---
Location: harness-main/app/services/instrument/tasks.go
Signals: N/A
Excerpt (<=80 chars):  type RepositoryCount struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryCount
- NewRepositoryCount
- Handle
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/instrument/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideGitConsumer(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideGitConsumer
- ProvideRepositoryCount
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: service_fetcher.go]---
Location: harness-main/app/services/keyfetcher/service_fetcher.go
Signals: N/A
Excerpt (<=80 chars):  type Service interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- FetchByFingerprint
- FetchBySubKeyID
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/keyfetcher/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
```

--------------------------------------------------------------------------------

---[FILE: handler_branch.go]---
Location: harness-main/app/services/keywordsearch/handler_branch.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) handleEventBranchCreated(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleEventBranchCreated
- handleEventBranchUpdated
- handleUpdateDefaultBranch
- indexRepo
- getBranchFromRef
```

--------------------------------------------------------------------------------

---[FILE: index_searcher.go]---
Location: harness-main/app/services/keywordsearch/index_searcher.go
Signals: N/A
Excerpt (<=80 chars):  type Indexer interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Indexer
- Searcher
```

--------------------------------------------------------------------------------

---[FILE: local_index_searcher.go]---
Location: harness-main/app/services/keywordsearch/local_index_searcher.go
Signals: N/A
Excerpt (<=80 chars):  type LocalIndexSearcher struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalIndexSearcher
- NewLocalIndexSearcher
- Search
- Index
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/keywordsearch/service.go
Signals: N/A
Excerpt (<=80 chars):  type Config struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
- Prepare
- NewService
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/keywordsearch/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideService(ctx context.Context,

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideService
- ProvideLocalIndexSearcher
- ProvideIndexer
- ProvideSearcher
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/app/services/label/label.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) Define(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Define
- Update
- Save
- Find
- FindWithValues
- FindByID
- List
- listInScopes
- Delete
- newLabel
- applyChanges
- checkLabelInScope
```

--------------------------------------------------------------------------------

---[FILE: label_pullreq.go]---
Location: harness-main/app/services/label/label_pullreq.go
Signals: N/A
Excerpt (<=80 chars):  type AssignToPullReqOut struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AssignToPullReqOut
- WithValue
- ToLabelPullReqAssignmentInfo
- AssignToPullReq
- PreparePullReqLabel
- AssignToPullReqOnCreation
- getOrDefineValue
- UnassignFromPullReq
- ListPullReqLabels
- Backfill
- BackfillMany
- populateScopeLabelsMap
- createScopeLabels
- newPullReqLabel
- checkPullreqLabelInScope
- backfillPullreqCount
```

--------------------------------------------------------------------------------

---[FILE: label_value.go]---
Location: harness-main/app/services/label/label_value.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) DefineValue(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefineValue
- applyValueChanges
- UpdateValue
- ListValues
- DeleteValue
- newLabelValue
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/label/service.go
Signals: N/A
Excerpt (<=80 chars):  type Service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- New
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/label/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideLabel(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideLabel
```

--------------------------------------------------------------------------------

---[FILE: locker.go]---
Location: harness-main/app/services/locker/locker.go
Signals: N/A
Excerpt (<=80 chars):  type Locker struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Locker
- NewLocker
- lock
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/app/services/locker/pullreq.go
Signals: N/A
Excerpt (<=80 chars):  func (l Locker) LockPR(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LockPR
```

--------------------------------------------------------------------------------

---[FILE: registryasynctask.go]---
Location: harness-main/app/services/locker/registryasynctask.go
Signals: N/A
Excerpt (<=80 chars):  func (l Locker) LockResource(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LockResource
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/app/services/locker/repo.go
Signals: N/A
Excerpt (<=80 chars):  func (l Locker) LockDefaultBranch(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LockDefaultBranch
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/locker/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideLocker(mtxManager lock.MutexManager) *Locker {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideLocker
```

--------------------------------------------------------------------------------

---[FILE: collector_job.go]---
Location: harness-main/app/services/metric/collector_job.go
Signals: N/A
Excerpt (<=80 chars):  type metricData struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- metricData
- CollectorJob
- NewCollectorJob
- Register
- Handle
```

--------------------------------------------------------------------------------

---[FILE: common.go]---
Location: harness-main/app/services/metric/common.go
Signals: N/A
Excerpt (<=80 chars):  type Object string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Submitter
```

--------------------------------------------------------------------------------

---[FILE: event_handlers.go]---
Location: harness-main/app/services/metric/event_handlers.go
Signals: N/A
Excerpt (<=80 chars):  func registerEventListeners(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handlersUser
- handlersRepo
- handlersPullReq
- handlersRule
- registerEventListeners
- prepareProps
- Register
- Create
- Login
- submit
- Push
- SoftDelete
- submitForActive
- submitForDeleted
- Close
```

--------------------------------------------------------------------------------

---[FILE: posthog.go]---
Location: harness-main/app/services/metric/posthog.go
Signals: N/A
Excerpt (<=80 chars):  type PostHog struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PostHog
- group
- logger
- NewPostHog
- SubmitGroups
- uniqueUserID
- Submit
- submitGroup
- submitDefaultGroup
- submitDefaultGroupOnce
- Logf
- Errorf
```

--------------------------------------------------------------------------------

---[FILE: values.go]---
Location: harness-main/app/services/metric/values.go
Signals: N/A
Excerpt (<=80 chars):  type Values struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Values
- NewValues
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/metric/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideValues(ctx context.Context, config *types.Config, settingsSrv *s...

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideValues
- ProvideSubmitter
- ProvideCollectorJob
```

--------------------------------------------------------------------------------

---[FILE: label.go]---
Location: harness-main/app/services/migrate/label.go
Signals: N/A
Excerpt (<=80 chars): type Label struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Label
- NewLabel
- Import
- defineLabelsAndValues
- convertLabelWithSanitization
- findClosestColor
- convertToColorful
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/app/services/migrate/pullreq.go
Signals: N/A
Excerpt (<=80 chars): type PullReq struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReq
- repoImportState
- NewPullReq
- Import
- convertPullReq
- createComments
- createComment
- createInfoComment
- getPrincipalByEmail
- assignLabels
- defineLabel
- defineLabelValue
- timestampMillis
- generateThreads
- getTopLevelParentID
- createReviewers
- createReviews
- createReviewerActivity
```

--------------------------------------------------------------------------------

---[FILE: pullreq_test.go]---
Location: harness-main/app/services/migrate/pullreq_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestGenerateThreads(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestGenerateThreads
- TestTimestampMillis
- TestActivitySeqOrdering
- TestReviewerActivityPayloadStructure
```

--------------------------------------------------------------------------------

---[FILE: pullreq_types.go]---
Location: harness-main/app/services/migrate/pullreq_types.go
Signals: N/A
Excerpt (<=80 chars):  type ExternalPullRequest = migratetypes.PullRequestData

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- externalCommentThread
```

--------------------------------------------------------------------------------

---[FILE: rule.go]---
Location: harness-main/app/services/migrate/rule.go
Signals: N/A
Excerpt (<=80 chars):  type Rule struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Rule
- NewRule
- Import
- mapToBranchRules
- convertMergeMethods
```

--------------------------------------------------------------------------------

---[FILE: rule_types.go]---
Location: harness-main/app/services/migrate/rule_types.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerDeserializers
```

--------------------------------------------------------------------------------

---[FILE: webhook.go]---
Location: harness-main/app/services/migrate/webhook.go
Signals: N/A
Excerpt (<=80 chars): type Webhook struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Webhook
- NewWebhook
- Import
- sanitizeWebhook
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/migrate/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvidePullReqImporter(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvidePullReqImporter
- ProvideRuleImporter
- ProvideWebhookImporter
- ProvideLabelImporter
```

--------------------------------------------------------------------------------

---[FILE: branch_updated.go]---
Location: harness-main/app/services/notification/branch_updated.go
Signals: N/A
Excerpt (<=80 chars):  type PullReqBranchUpdatedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqBranchUpdatedPayload
- notifyPullReqBranchUpdated
- processPullReqBranchUpdatedEvent
```

--------------------------------------------------------------------------------

---[FILE: client_interface.go]---
Location: harness-main/app/services/notification/client_interface.go
Signals: N/A
Excerpt (<=80 chars): type Client interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Client
```

--------------------------------------------------------------------------------

---[FILE: comment_created.go]---
Location: harness-main/app/services/notification/comment_created.go
Signals: N/A
Excerpt (<=80 chars):  type CommentPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentPayload
- notifyCommentCreated
- processCommentCreatedEvent
- processMentions
- processParticipants
```

--------------------------------------------------------------------------------

---[FILE: mail_client.go]---
Location: harness-main/app/services/notification/mail_client.go
Signals: N/A
Excerpt (<=80 chars):  type MailClient struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailClient
- NewMailClient
- SendCommentPRAuthor
- SendCommentMentions
- SendCommentParticipants
- SendReviewerAdded
- SendPullReqBranchUpdated
- SendReviewSubmitted
- SendPullReqStateChanged
- GetSubjectPullRequest
- GetHTMLBody
- GenerateEmailFromPayload
- RetrieveEmailsFromPrincipals
```

--------------------------------------------------------------------------------

---[FILE: pullreq_created.go]---
Location: harness-main/app/services/notification/pullreq_created.go
Signals: N/A
Excerpt (<=80 chars):  func (s *Service) notifyPullReqCreated(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- notifyPullReqCreated
```

--------------------------------------------------------------------------------

---[FILE: pullreq_state.go]---
Location: harness-main/app/services/notification/pullreq_state.go
Signals: N/A
Excerpt (<=80 chars):  type PullReqState string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullReqStateChangedPayload
- notifyPullReqStateMerged
- notifyPullReqStateClosed
- notifyPullReqStateReOpened
- processPullReqStateChangedEvent
```

--------------------------------------------------------------------------------

---[FILE: reviewer_added.go]---
Location: harness-main/app/services/notification/reviewer_added.go
Signals: N/A
Excerpt (<=80 chars):  type ReviewerAddedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewerAddedPayload
- notifyReviewerAdded
- processReviewerAddedEvent
```

--------------------------------------------------------------------------------

---[FILE: review_submitted.go]---
Location: harness-main/app/services/notification/review_submitted.go
Signals: N/A
Excerpt (<=80 chars):  type ReviewSubmittedPayload struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewSubmittedPayload
- notifyReviewSubmitted
- processReviewSubmittedEvent
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/notification/service.go
Signals: N/A
Excerpt (<=80 chars):  func init() {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BasePullReqPayload
- Config
- init
- LoadTemplates
- NewService
- getBasePayload
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/notification/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideNotificationService(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideNotificationService
- ProvideMailClient
```

--------------------------------------------------------------------------------

---[FILE: mail.go]---
Location: harness-main/app/services/notification/mailer/mail.go
Signals: N/A
Excerpt (<=80 chars):  type GoMailClient struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoMailClient
- NewMailClient
- Send
```

--------------------------------------------------------------------------------

---[FILE: mail_interface.go]---
Location: harness-main/app/services/notification/mailer/mail_interface.go
Signals: N/A
Excerpt (<=80 chars):  type Mailer interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mailer
- Payload
- ToGoMail
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/notification/mailer/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideMailClient(config *types.Config) Mailer {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideMailClient
```

--------------------------------------------------------------------------------

---[FILE: bypass.go]---
Location: harness-main/app/services/protection/bypass.go
Signals: N/A
Excerpt (<=80 chars):  type DefBypass struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefBypass
- matches
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: bypass_test.go]---
Location: harness-main/app/services/protection/bypass_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestBranch_matches(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestBranch_matches
```

--------------------------------------------------------------------------------

---[FILE: json.go]---
Location: harness-main/app/services/protection/json.go
Signals: N/A
Excerpt (<=80 chars): func ToJSON(v any) (json.RawMessage, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToJSON
```

--------------------------------------------------------------------------------

---[FILE: pattern.go]---
Location: harness-main/app/services/protection/pattern.go
Signals: N/A
Excerpt (<=80 chars):  type Pattern struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pattern
- JSON
- Validate
- Matches
- patternValidate
- patternMatches
- matchesRef
- matchesRefs
```

--------------------------------------------------------------------------------

---[FILE: pattern_test.go]---
Location: harness-main/app/services/protection/pattern_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestPattern_Matches(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestPattern_Matches
- TestPattern_Validate
- TestPattern_patternMatches
```

--------------------------------------------------------------------------------

---[FILE: repo_target.go]---
Location: harness-main/app/services/protection/repo_target.go
Signals: N/A
Excerpt (<=80 chars):  type RepoTargetFilter struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepoTargetFilter
- RepoTarget
- JSON
- Validate
- Matches
- matchesRepo
```

--------------------------------------------------------------------------------

---[FILE: repo_target_test.go]---
Location: harness-main/app/services/protection/repo_target_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestRepoTarget_Matches(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRepoTarget_Matches
```

--------------------------------------------------------------------------------

---[FILE: rule_branch.go]---
Location: harness-main/app/services/protection/rule_branch.go
Signals: N/A
Excerpt (<=80 chars): type Branch struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Branch
- MergeVerify
- RequiredChecks
- CreatePullReqVerify
- RefChangeVerify
- UserIDs
- UserGroupIDs
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: rule_branch_infos.go]---
Location: harness-main/app/services/protection/rule_branch_infos.go
Signals: N/A
Excerpt (<=80 chars):  func GetBranchRuleInfos(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetBranchRuleInfos
```

--------------------------------------------------------------------------------

---[FILE: rule_branch_test.go]---
Location: harness-main/app/services/protection/rule_branch_test.go
Signals: N/A
Excerpt (<=80 chars): func TestBranch_MergeVerify(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestBranch_MergeVerify
- TestBranch_RequiredChecks
- TestBranch_RefChangeVerify
- mockUserGroupResolver
```

--------------------------------------------------------------------------------

---[FILE: rule_push.go]---
Location: harness-main/app/services/protection/rule_push.go
Signals: N/A
Excerpt (<=80 chars): type Push struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Push
- PushVerify
- Violations
- UserIDs
- UserGroupIDs
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: rule_tag.go]---
Location: harness-main/app/services/protection/rule_tag.go
Signals: N/A
Excerpt (<=80 chars): type Tag struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tag
- RefChangeVerify
- UserIDs
- UserGroupIDs
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/protection/service.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IsCritical
- IsBypassed
- NewManager
- Register
- FromJSON
- SanitizeJSON
- ListRepoRules
- ListRepoBranchRules
- ListRepoTagRules
- ListRepoPushRules
- FilterCreateBranchProtection
- FilterCreateTagProtection
- FilterCreatePushProtection
- printRuleScope
- GenerateErrorMessageForBlockingViolations
```

--------------------------------------------------------------------------------

---[FILE: service_test.go]---
Location: harness-main/app/services/protection/service_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestIsCritical(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- testCase
- TestIsCritical
- TestManager_SanitizeJSON
- TestGenerateErrorMessageForBlockingViolations
```

--------------------------------------------------------------------------------

---[FILE: set_branch.go]---
Location: harness-main/app/services/protection/set_branch.go
Signals: N/A
Excerpt (<=80 chars):  type branchRuleSet struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- branchRuleSet
- MergeVerify
- RequiredChecks
- CreatePullReqVerify
- RefChangeVerify
- UserIDs
- UserGroupIDs
- forEachRuleMatchBranch
- backFillRule
- maxInt
- deduplicateInt64Slice
```

--------------------------------------------------------------------------------

---[FILE: set_branch_test.go]---
Location: harness-main/app/services/protection/set_branch_test.go
Signals: N/A
Excerpt (<=80 chars): func TestRuleSet_MergeVerify(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRuleSet_MergeVerify
- TestRuleSet_RequiredChecks
- TestIntersectSorted
```

--------------------------------------------------------------------------------

---[FILE: set_common.go]---
Location: harness-main/app/services/protection/set_common.go
Signals: N/A
Excerpt (<=80 chars):  func forEachRule(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- forEachRule
- collectIDs
- refChangeVerifyFunc
- forEachRuleMatchRefs
```

--------------------------------------------------------------------------------

---[FILE: set_push.go]---
Location: harness-main/app/services/protection/set_push.go
Signals: N/A
Excerpt (<=80 chars):  type pushRuleSet struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pushRuleSet
- PushVerify
- Violations
- UserIDs
- UserGroupIDs
```

--------------------------------------------------------------------------------

---[FILE: set_tag.go]---
Location: harness-main/app/services/protection/set_tag.go
Signals: N/A
Excerpt (<=80 chars):  type tagRuleSet struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tagRuleSet
- RefChangeVerify
- UserIDs
- UserGroupIDs
```

--------------------------------------------------------------------------------

---[FILE: set_tag_test.go]---
Location: harness-main/app/services/protection/set_tag_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestTagRuleSet_SetRefChangeVerify(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestTagRuleSet_SetRefChangeVerify
```

--------------------------------------------------------------------------------

---[FILE: validators.go]---
Location: harness-main/app/services/protection/validators.go
Signals: N/A
Excerpt (<=80 chars):  func validateIDSlice(ids []int64) error {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateIDSlice
- validateIdentifierSlice
```

--------------------------------------------------------------------------------

---[FILE: verify_lifecycle.go]---
Location: harness-main/app/services/protection/verify_lifecycle.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RefChangeVerify
- Sanitize
```

--------------------------------------------------------------------------------

---[FILE: verify_lifecycle_test.go]---
Location: harness-main/app/services/protection/verify_lifecycle_test.go
Signals: N/A
Excerpt (<=80 chars): func TestDefLifecycle_RefChangeVerify(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDefLifecycle_RefChangeVerify
- inspectBranchViolations
```

--------------------------------------------------------------------------------

---[FILE: verify_pullreq.go]---
Location: harness-main/app/services/protection/verify_pullreq.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefApprovals
- DefComments
- DefStatusChecks
- DefMerge
- DefReviewers
- DefPullReq
- MergeVerify
- RequiredChecks
- CreatePullReqVerify
- Sanitize
- MarshalJSON
- UnmarshalJSON
- getCodeOwnerApprovalStatus
```

--------------------------------------------------------------------------------

---[FILE: verify_pullreq_test.go]---
Location: harness-main/app/services/protection/verify_pullreq_test.go
Signals: N/A
Excerpt (<=80 chars): func TestDefPullReq_MergeVerify(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestDefPullReq_MergeVerify
- sortEvaluations
```

--------------------------------------------------------------------------------

---[FILE: verify_push.go]---
Location: harness-main/app/services/protection/verify_push.go
Signals: N/A
Excerpt (<=80 chars):  type (

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HasViolations
- PushVerify
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/protection/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvideManager(ruleStore store.RuleStore) (*Manager, error) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvideManager
```

--------------------------------------------------------------------------------

---[FILE: resources.go]---
Location: harness-main/app/services/publicaccess/resources.go
Signals: N/A
Excerpt (<=80 chars):  func (s *service) getResourceID(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getResourceID
- getResourceRepo
- getResourceSpace
- getResourceRegistry
```

--------------------------------------------------------------------------------

---[FILE: service.go]---
Location: harness-main/app/services/publicaccess/service.go
Signals: N/A
Excerpt (<=80 chars):  type service struct {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewService
- Get
- Set
- Delete
- IsPublicAccessSupported
```

--------------------------------------------------------------------------------

---[FILE: wire.go]---
Location: harness-main/app/services/publicaccess/wire.go
Signals: N/A
Excerpt (<=80 chars):  func ProvidePublicAccess(

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProvidePublicAccess
```

--------------------------------------------------------------------------------

---[FILE: parse.go]---
Location: harness-main/app/services/publickey/parse.go
Signals: N/A
Excerpt (<=80 chars):  type KeyInfo interface {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeyInfo
- ParseString
```

--------------------------------------------------------------------------------

````
