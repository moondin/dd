---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 17
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 17 of 51)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - n8n-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/n8n-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: source-control-helper.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-helper.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export function stringContainsExpression(testString: string): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stringContainsExpression
- getWorkflowExportPath
- getProjectExportPath
- getCredentialExportPath
- getVariablesPath
- getTagsPath
- getFoldersPath
- sourceControlFoldersExistCheck
- isSourceControlLicensed
- getRepoType
- getTrackingInformationFromPullResult
- getTrackingInformationFromPrePushResult
- getTrackingInformationFromPostPushResult
- normalizeAndValidateSourceControlledFilePath
- hasOwnerChanged
- isWorkflowModified
```

--------------------------------------------------------------------------------

---[FILE: source-control-import.service.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-import.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlImportService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlImportService
```

--------------------------------------------------------------------------------

---[FILE: source-control-preferences.service.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-preferences.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlPreferencesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlPreferencesService
```

--------------------------------------------------------------------------------

---[FILE: source-control-resource-helper.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-resource-helper.ts
Signals: N/A
Excerpt (<=80 chars):  export function filterByType(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filterByType
- getDeletedResources
- getNonDeletedResources
```

--------------------------------------------------------------------------------

---[FILE: source-control-scoped.service.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-scoped.service.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlScopedService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlScopedService
```

--------------------------------------------------------------------------------

---[FILE: source-control-status.service.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-status.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlStatusService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlStatusService
```

--------------------------------------------------------------------------------

---[FILE: source-control.config.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control.config.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlConfig
```

--------------------------------------------------------------------------------

---[FILE: source-control.controller.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control.controller.ee.ts
Signals: Express
Excerpt (<=80 chars): export class SourceControlController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlController
```

--------------------------------------------------------------------------------

---[FILE: source-control.service.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlService
```

--------------------------------------------------------------------------------

---[FILE: source-control-enabled-middleware.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/middleware/source-control-enabled-middleware.ee.ts
Signals: Express
Excerpt (<=80 chars):  export const sourceControlLicensedAndEnabledMiddleware: RequestHandler = (_r...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: export-result.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/export-result.ts
Signals: N/A
Excerpt (<=80 chars): export interface ExportResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportResult
```

--------------------------------------------------------------------------------

---[FILE: exportable-credential.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/exportable-credential.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExportableCredential {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StatusExportableCredential
- ExportableCredential
```

--------------------------------------------------------------------------------

---[FILE: exportable-folders.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/exportable-folders.ts
Signals: N/A
Excerpt (<=80 chars): export type ExportableFolder = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportableFolder
- ExportedFolders
```

--------------------------------------------------------------------------------

---[FILE: exportable-project.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/exportable-project.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExportableProject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportableProjectWithFileName
- ExportableProject
```

--------------------------------------------------------------------------------

---[FILE: exportable-tags.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/exportable-tags.ts
Signals: N/A
Excerpt (<=80 chars):  export type ExportableTags = { tags: TagEntity[]; mappings: WorkflowTagMappi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportableTags
```

--------------------------------------------------------------------------------

---[FILE: exportable-variable.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/exportable-variable.ts
Signals: N/A
Excerpt (<=80 chars): export interface ExportableVariable {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportableVariable
```

--------------------------------------------------------------------------------

---[FILE: exportable-workflow.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/exportable-workflow.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExportableWorkflow {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportableWorkflow
```

--------------------------------------------------------------------------------

---[FILE: import-result.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/import-result.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ImportResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportResult
```

--------------------------------------------------------------------------------

---[FILE: key-pair-type.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/key-pair-type.ts
Signals: N/A
Excerpt (<=80 chars): export type KeyPairType = 'ed25519' | 'rsa';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeyPairType
```

--------------------------------------------------------------------------------

---[FILE: key-pair.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/key-pair.ts
Signals: N/A
Excerpt (<=80 chars): export interface KeyPair {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeyPair
```

--------------------------------------------------------------------------------

---[FILE: resource-owner.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/resource-owner.ts
Signals: N/A
Excerpt (<=80 chars): export type PersonalResourceOwner = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PersonalResourceOwner
- TeamResourceOwner
- RemoteResourceOwner
- StatusResourceOwner
```

--------------------------------------------------------------------------------

---[FILE: source-control-commit.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-commit.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlCommit {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlCommit
```

--------------------------------------------------------------------------------

---[FILE: source-control-context.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlContext
```

--------------------------------------------------------------------------------

---[FILE: source-control-disconnect.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-disconnect.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlDisconnect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlDisconnect
```

--------------------------------------------------------------------------------

---[FILE: source-control-generate-key-pair.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-generate-key-pair.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlGenerateKeyPair {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlGenerateKeyPair
```

--------------------------------------------------------------------------------

---[FILE: source-control-get-status.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-get-status.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlGetStatus {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlGetStatus
```

--------------------------------------------------------------------------------

---[FILE: source-control-preferences.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-preferences.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlPreferences {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlPreferences
```

--------------------------------------------------------------------------------

---[FILE: source-control-push.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-push.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlPush {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlPush
```

--------------------------------------------------------------------------------

---[FILE: source-control-set-branch.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-set-branch.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlSetBranch {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlSetBranch
```

--------------------------------------------------------------------------------

---[FILE: source-control-set-read-only.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-set-read-only.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlSetReadOnly {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlSetReadOnly
```

--------------------------------------------------------------------------------

---[FILE: source-control-stage.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-stage.ts
Signals: N/A
Excerpt (<=80 chars):  export class SourceControlStage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlStage
```

--------------------------------------------------------------------------------

---[FILE: source-control-workflow-version-id.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/types/source-control-workflow-version-id.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SourceControlWorkflowVersionId {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlWorkflowVersionId
```

--------------------------------------------------------------------------------

---[FILE: source-control.controller.ee.test.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/__tests__/source-control.controller.ee.test.ts
Signals: Express
Excerpt (<=80 chars): import type { PullWorkFolderRequestDto, PushWorkFolderRequestDto } from '@n8n...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: variables.controller.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/variables/variables.controller.ee.ts
Signals: Express
Excerpt (<=80 chars): export class VariablesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VariablesController
```

--------------------------------------------------------------------------------

---[FILE: variables.service.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/variables/variables.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class VariablesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VariablesService
```

--------------------------------------------------------------------------------

---[FILE: aborted-execution-retry.error.ts]---
Location: n8n-master/packages/cli/src/errors/aborted-execution-retry.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class AbortedExecutionRetryError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbortedExecutionRetryError
```

--------------------------------------------------------------------------------

---[FILE: credential-not-found.error.ts]---
Location: n8n-master/packages/cli/src/errors/credential-not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialNotFoundError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: credentials-overwrites-already-set.error.ts]---
Location: n8n-master/packages/cli/src/errors/credentials-overwrites-already-set.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialsOverwritesAlreadySetError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsOverwritesAlreadySetError
```

--------------------------------------------------------------------------------

---[FILE: deduplication.error.ts]---
Location: n8n-master/packages/cli/src/errors/deduplication.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class DeduplicationError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeduplicationError
```

--------------------------------------------------------------------------------

---[FILE: execution-already-resuming.error.ts]---
Location: n8n-master/packages/cli/src/errors/execution-already-resuming.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecutionAlreadyResumingError extends OperationalError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionAlreadyResumingError
```

--------------------------------------------------------------------------------

---[FILE: execution-not-found-error.ts]---
Location: n8n-master/packages/cli/src/errors/execution-not-found-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecutionNotFoundError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: feature-not-licensed.error.ts]---
Location: n8n-master/packages/cli/src/errors/feature-not-licensed.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class FeatureNotLicensedError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FeatureNotLicensedError
```

--------------------------------------------------------------------------------

---[FILE: folder-not-found.error.ts]---
Location: n8n-master/packages/cli/src/errors/folder-not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class FolderNotFoundError extends OperationalError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: invalid-concurrency-limit.error.ts]---
Location: n8n-master/packages/cli/src/errors/invalid-concurrency-limit.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidConcurrencyLimitError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidConcurrencyLimitError
```

--------------------------------------------------------------------------------

---[FILE: invalid-role.error.ts]---
Location: n8n-master/packages/cli/src/errors/invalid-role.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidRoleError extends UnexpectedError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidRoleError
```

--------------------------------------------------------------------------------

---[FILE: max-stalled-count.error.ts]---
Location: n8n-master/packages/cli/src/errors/max-stalled-count.error.ts
Signals: N/A
Excerpt (<=80 chars): export class MaxStalledCountError extends OperationalError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MaxStalledCountError
```

--------------------------------------------------------------------------------

---[FILE: missing-execution-stop.error.ts]---
Location: n8n-master/packages/cli/src/errors/missing-execution-stop.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class MissingExecutionStopError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingExecutionStopError
```

--------------------------------------------------------------------------------

---[FILE: node-crashed.error.ts]---
Location: n8n-master/packages/cli/src/errors/node-crashed.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class NodeCrashedError extends NodeOperationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeCrashedError
```

--------------------------------------------------------------------------------

---[FILE: non-json-body.error.ts]---
Location: n8n-master/packages/cli/src/errors/non-json-body.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class NonJsonBodyError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NonJsonBodyError
```

--------------------------------------------------------------------------------

---[FILE: postgres-live-rows-retrieval.error.ts]---
Location: n8n-master/packages/cli/src/errors/postgres-live-rows-retrieval.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class PostgresLiveRowsRetrievalError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PostgresLiveRowsRetrievalError
```

--------------------------------------------------------------------------------

---[FILE: queued-execution-retry.error.ts]---
Location: n8n-master/packages/cli/src/errors/queued-execution-retry.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class QueuedExecutionRetryError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueuedExecutionRetryError
```

--------------------------------------------------------------------------------

---[FILE: redactable.error.ts]---
Location: n8n-master/packages/cli/src/errors/redactable.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class RedactableError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RedactableError
```

--------------------------------------------------------------------------------

---[FILE: shared-workflow-not-found.error.ts]---
Location: n8n-master/packages/cli/src/errors/shared-workflow-not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class SharedWorkflowNotFoundError extends UserError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharedWorkflowNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: single-webhook-trigger.error.ts]---
Location: n8n-master/packages/cli/src/errors/single-webhook-trigger.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class SingleWebhookTriggerError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SingleWebhookTriggerError
```

--------------------------------------------------------------------------------

---[FILE: subworkflow-policy-denial.error.ts]---
Location: n8n-master/packages/cli/src/errors/subworkflow-policy-denial.error.ts
Signals: N/A
Excerpt (<=80 chars):  export const SUBWORKFLOW_DENIAL_BASE_DESCRIPTION =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SUBWORKFLOW_DENIAL_BASE_DESCRIPTION
- SubworkflowPolicyDenialError
```

--------------------------------------------------------------------------------

---[FILE: unknown-execution-mode.error.ts]---
Location: n8n-master/packages/cli/src/errors/unknown-execution-mode.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UnknownExecutionModeError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnknownExecutionModeError
```

--------------------------------------------------------------------------------

---[FILE: variable-count-limit-reached.error.ts]---
Location: n8n-master/packages/cli/src/errors/variable-count-limit-reached.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class VariableCountLimitReachedError extends UserError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VariableCountLimitReachedError
```

--------------------------------------------------------------------------------

---[FILE: variable-validation.error.ts]---
Location: n8n-master/packages/cli/src/errors/variable-validation.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class VariableValidationError extends UnexpectedError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VariableValidationError
```

--------------------------------------------------------------------------------

---[FILE: workflow-crashed.error.ts]---
Location: n8n-master/packages/cli/src/errors/workflow-crashed.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowCrashedError extends WorkflowOperationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowCrashedError
```

--------------------------------------------------------------------------------

---[FILE: workflow-history-version-not-found.error.ts]---
Location: n8n-master/packages/cli/src/errors/workflow-history-version-not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowHistoryVersionNotFoundError extends UnexpectedError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistoryVersionNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: workflow-missing-id.error.ts]---
Location: n8n-master/packages/cli/src/errors/workflow-missing-id.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowMissingIdError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowMissingIdError
```

--------------------------------------------------------------------------------

---[FILE: malformed-refresh-value.error.ts]---
Location: n8n-master/packages/cli/src/errors/cache-errors/malformed-refresh-value.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class MalformedRefreshValueError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MalformedRefreshValueError
```

--------------------------------------------------------------------------------

---[FILE: uncacheable-value.error.ts]---
Location: n8n-master/packages/cli/src/errors/cache-errors/uncacheable-value.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UncacheableValueError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UncacheableValueError
```

--------------------------------------------------------------------------------

---[FILE: auth.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/auth.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class AuthError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthError
```

--------------------------------------------------------------------------------

---[FILE: bad-request.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/bad-request.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class BadRequestError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BadRequestError
```

--------------------------------------------------------------------------------

---[FILE: conflict.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/conflict.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ConflictError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConflictError
```

--------------------------------------------------------------------------------

---[FILE: content-too-large.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/content-too-large.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ContentTooLargeError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContentTooLargeError
```

--------------------------------------------------------------------------------

---[FILE: forbidden.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/forbidden.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ForbiddenError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ForbiddenError
```

--------------------------------------------------------------------------------

---[FILE: internal-server.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/internal-server.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InternalServerError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InternalServerError
```

--------------------------------------------------------------------------------

---[FILE: invalid-mfa-code.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/invalid-mfa-code.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidMfaCodeError extends ForbiddenError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidMfaCodeError
```

--------------------------------------------------------------------------------

---[FILE: invalid-mfa-recovery-code-error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/invalid-mfa-recovery-code-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidMfaRecoveryCodeError extends ForbiddenError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidMfaRecoveryCodeError
```

--------------------------------------------------------------------------------

---[FILE: license-eula-required.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/license-eula-required.error.ts
Signals: N/A
Excerpt (<=80 chars): export class LicenseEulaRequiredError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseEulaRequiredError
```

--------------------------------------------------------------------------------

---[FILE: not-found.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class NotFoundError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NotFoundError
```

--------------------------------------------------------------------------------

---[FILE: not-implemented.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/not-implemented.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class NotImplementedError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NotImplementedError
```

--------------------------------------------------------------------------------

---[FILE: service-unavailable.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/service-unavailable.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ServiceUnavailableError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServiceUnavailableError
```

--------------------------------------------------------------------------------

---[FILE: too-many-requests.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/too-many-requests.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TooManyRequestsError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TooManyRequestsError
```

--------------------------------------------------------------------------------

---[FILE: transfer-credential.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/transfer-credential.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TransferCredentialError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TransferCredentialError
```

--------------------------------------------------------------------------------

---[FILE: transfer-workflow.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/transfer-workflow.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TransferWorkflowError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TransferWorkflowError
```

--------------------------------------------------------------------------------

---[FILE: unauthenticated.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/unauthenticated.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UnauthenticatedError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnauthenticatedError
```

--------------------------------------------------------------------------------

---[FILE: unprocessable.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/unprocessable.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UnprocessableRequestError extends ResponseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnprocessableRequestError
```

--------------------------------------------------------------------------------

---[FILE: webhook-not-found.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/webhook-not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export const webhookNotFoundErrorMessage = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- webhookNotFoundErrorMessage
- WebhookNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: workflow-validation.error.ts]---
Location: n8n-master/packages/cli/src/errors/response-errors/workflow-validation.error.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowValidationError extends BadRequestError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowValidationError
```

--------------------------------------------------------------------------------

---[FILE: test-runs.controller.ee.ts]---
Location: n8n-master/packages/cli/src/evaluation.ee/test-runs.controller.ee.ts
Signals: Express
Excerpt (<=80 chars): export class TestRunsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRunsController
```

--------------------------------------------------------------------------------

---[FILE: errors.ee.ts]---
Location: n8n-master/packages/cli/src/evaluation.ee/test-runner/errors.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestCaseExecutionError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCaseExecutionError
- TestRunError
```

--------------------------------------------------------------------------------

---[FILE: evaluation-metrics.ee.ts]---
Location: n8n-master/packages/cli/src/evaluation.ee/test-runner/evaluation-metrics.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EvaluationMetricsAddResultsInfo {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EvaluationMetrics
- EvaluationMetricsAddResultsInfo
```

--------------------------------------------------------------------------------

---[FILE: test-run-cleanup.service.ee.ts]---
Location: n8n-master/packages/cli/src/evaluation.ee/test-runner/test-run-cleanup.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class TestRunCleanupService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRunCleanupService
```

--------------------------------------------------------------------------------

---[FILE: test-runner.service.ee.ts]---
Location: n8n-master/packages/cli/src/evaluation.ee/test-runner/test-runner.service.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TestRunMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRunnerService
- TestRunMetadata
- TestCaseExecutionResult
```

--------------------------------------------------------------------------------

---[FILE: utils.ee.ts]---
Location: n8n-master/packages/cli/src/evaluation.ee/test-runner/utils.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export function checkNodeParameterNotEmpty(value: NodeParameterValueType) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkNodeParameterNotEmpty
- extractTokenUsage
```

--------------------------------------------------------------------------------

---[FILE: event-bus.controller.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-bus.controller.ts
Signals: Express
Excerpt (<=80 chars): export class EventBusController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventBusController
```

--------------------------------------------------------------------------------

---[FILE: abstract-event-message-options.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/abstract-event-message-options.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AbstractEventMessageOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbstractEventMessageOptions
```

--------------------------------------------------------------------------------

---[FILE: abstract-event-message.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/abstract-event-message.ts
Signals: N/A
Excerpt (<=80 chars):  export const isEventMessage = (candidate: unknown): candidate is AbstractEve...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isEventMessage
- isEventMessageOptions
- isEventMessageOptionsWithType
```

--------------------------------------------------------------------------------

---[FILE: abstract-event-payload.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/abstract-event-payload.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbstractEventPayload
```

--------------------------------------------------------------------------------

---[FILE: event-message-ai-node.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-ai-node.ts
Signals: N/A
Excerpt (<=80 chars): export interface EventPayloadAiNode extends AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMessageAiNode
- EventPayloadAiNode
- EventMessageAiNodeOptions
```

--------------------------------------------------------------------------------

---[FILE: event-message-audit.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-audit.ts
Signals: N/A
Excerpt (<=80 chars): export interface EventPayloadAudit extends AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMessageAudit
- EventPayloadAudit
- EventMessageAuditOptions
```

--------------------------------------------------------------------------------

---[FILE: event-message-confirm.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-confirm.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EventMessageConfirmSource extends JsonObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isEventMessageConfirm
- EventMessageConfirm
- EventMessageConfirmSource
```

--------------------------------------------------------------------------------

---[FILE: event-message-execution.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-execution.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EventPayloadExecution extends AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMessageExecution
- EventPayloadExecution
- EventMessageExecutionOptions
```

--------------------------------------------------------------------------------

````
