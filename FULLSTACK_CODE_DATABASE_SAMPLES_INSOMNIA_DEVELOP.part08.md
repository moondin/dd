---
source_txt: fullstack_samples/insomnia-develop
converted_utc: 2025-12-18T10:36:55Z
part: 8
parts_total: 10
---

# FULLSTACK CODE DATABASE SAMPLES insomnia-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 8 of 10)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - insomnia-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/insomnia-develop
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: new-workspace-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/new-workspace-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const NewWorkspaceModal = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewWorkspaceModal
```

--------------------------------------------------------------------------------

---[FILE: nunjucks-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/nunjucks-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface NunjucksModalHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NunjucksModal
- NunjucksModalHandle
```

--------------------------------------------------------------------------------

---[FILE: oauth-authorization-status-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/oauth-authorization-status-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const OAuthAuthorizationStatusModal: FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: paste-curl-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/paste-curl-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const PasteCurlModal = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasteCurlModal
```

--------------------------------------------------------------------------------

---[FILE: project-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/project-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const ProjectModal = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectModal
```

--------------------------------------------------------------------------------

---[FILE: prompt-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/prompt-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface PromptModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PromptModal
- PromptModalOptions
- PromptModalHandle
```

--------------------------------------------------------------------------------

---[FILE: proto-files-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/proto-files-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface Props {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Props
```

--------------------------------------------------------------------------------

---[FILE: request-group-settings-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/request-group-settings-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface RequestGroupSettingsModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestGroupSettingsModal
- RequestGroupSettingsModalOptions
```

--------------------------------------------------------------------------------

---[FILE: request-render-error-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/request-render-error-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface RequestRenderErrorModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestRenderErrorModal
- RequestRenderErrorModalOptions
- RequestRenderErrorModalHandle
```

--------------------------------------------------------------------------------

---[FILE: request-settings-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/request-settings-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface RequestSettingsModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestSettingsModal
- RequestSettingsModalOptions
```

--------------------------------------------------------------------------------

---[FILE: response-debug-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/response-debug-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface ResponseDebugModalHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResponseDebugModal
- ResponseDebugModalHandle
```

--------------------------------------------------------------------------------

---[FILE: select-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/select-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface SelectModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectModal
- showSelectModal
- SelectModalOptions
- SelectModalHandle
```

--------------------------------------------------------------------------------

---[FILE: settings-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/settings-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface SettingsModalHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TAB_INDEX_EXPORT
- TAB_INDEX_SHORTCUTS
- TAB_INDEX_THEMES
- TAB_INDEX_PLUGINS
- TAB_INDEX_AI
- TAB_CLOUD_CREDENTIAL
- SettingsModal
- showSettingsModal
- SettingsModalHandle
```

--------------------------------------------------------------------------------

---[FILE: sync-branches-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/sync-branches-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const SyncBranchesModal = ({ onClose, branches, remoteBranches, curre...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncBranchesModal
```

--------------------------------------------------------------------------------

---[FILE: sync-delete-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/sync-delete-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const SyncDeleteModal = ({ vcs, onHide }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncDeleteModal
```

--------------------------------------------------------------------------------

---[FILE: sync-history-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/sync-history-modal.tsx
Signals: N/A
Excerpt (<=80 chars):  export const SyncHistoryModal = ({ history, onClose }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncHistoryModal
```

--------------------------------------------------------------------------------

---[FILE: sync-merge-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/sync-merge-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface SyncMergeModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncMergeModal
- SyncMergeModalOptions
- SyncMergeModalHandle
```

--------------------------------------------------------------------------------

---[FILE: sync-staging-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/sync-staging-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const SyncStagingModal = ({ onClose, status, syncItems }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncStagingModal
```

--------------------------------------------------------------------------------

---[FILE: upgrade-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/upgrade-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface UpgradeModalOptions extends Partial<AskModalOptions> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpgradeModal
- UpgradeModalOptions
- UpgradeModalHandle
```

--------------------------------------------------------------------------------

---[FILE: upgrade-plan-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/upgrade-plan-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface UpgradeModalOptions extends Partial<any> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpgradePlanModal
- UpgradeModalOptions
- UpgradeModalHandle
```

--------------------------------------------------------------------------------

---[FILE: upload-runner-data-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/upload-runner-data-modal.tsx
Signals: React
Excerpt (<=80 chars):  export type UploadDataType = Record<string, any>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- genPreviewTableData
- UploadDataModal
- UploadDataType
- UploadDataModalProps
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/utils.ts
Signals: N/A
Excerpt (<=80 chars): export const wrapToIndex = (index: number, maxCount: number) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- wrapToIndex
```

--------------------------------------------------------------------------------

---[FILE: variable-missing-error-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/variable-missing-error-modal.tsx
Signals: N/A
Excerpt (<=80 chars):  export const VariableMissingErrorModal = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VariableMissingErrorModal
```

--------------------------------------------------------------------------------

---[FILE: workspace-certificates-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/workspace-certificates-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const CACertificate = ({ caCertificate, tip }: { caCertificate?: CaCe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CACertificate
- CertificatesModal
```

--------------------------------------------------------------------------------

---[FILE: workspace-duplicate-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/workspace-duplicate-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const WorkspaceDuplicateModal: FC<WorkspaceDuplicateModalProps> = ({ ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workspace-environments-edit-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/workspace-environments-edit-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const WorkspaceEnvironmentsEditModal = ({ onClose }: { onClose: () =>...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkspaceEnvironmentsEditModal
```

--------------------------------------------------------------------------------

---[FILE: workspace-settings-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/workspace-settings-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const WorkspaceSettingsModal = ({ workspace, gitFilePath, project, mo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkspaceSettingsModal
```

--------------------------------------------------------------------------------

---[FILE: wrapper-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/wrapper-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface WrapperModalHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WrapperModal
- WrapperModalHandle
```

--------------------------------------------------------------------------------

---[FILE: aws-credential-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/cloud-credential-modal/aws-credential-form.tsx
Signals: React
Excerpt (<=80 chars): export interface AWSCredentialFormProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AWSCredentialForm
- AWSCredentialFormProps
```

--------------------------------------------------------------------------------

---[FILE: cloud-credential-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/cloud-credential-modal/cloud-credential-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface CloudCredentialModalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CloudCredentialModal
- CloudCredentialModalProps
```

--------------------------------------------------------------------------------

---[FILE: file-picker.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/cloud-credential-modal/file-picker.tsx
Signals: React
Excerpt (<=80 chars):  export interface FilePickerProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilePicker
- FilePickerProps
```

--------------------------------------------------------------------------------

---[FILE: gcp-credential-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/cloud-credential-modal/gcp-credential-form.tsx
Signals: React
Excerpt (<=80 chars): export interface GCPCredentialFormProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GCPCredentialForm
- GCPCredentialFormProps
```

--------------------------------------------------------------------------------

---[FILE: hashicorp-credential-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/cloud-credential-modal/hashicorp-credential-form.tsx
Signals: React
Excerpt (<=80 chars): export interface HashiCorpCredentialFormProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HashiCorpCredentialForm
- HashiCorpCredentialFormProps
```

--------------------------------------------------------------------------------

---[FILE: git-repository-settings-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-repository-settings-modal/git-repository-settings-modal.tsx
Signals: React
Excerpt (<=80 chars):  export function getDefaultOAuthProvider(credentials?: GitCredentials | null)...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefaultOAuthProvider
- GitRepositorySettingsModal
```

--------------------------------------------------------------------------------

---[FILE: import-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/import-modal/import-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const Radio: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: import-projects-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/import-modal/import-projects-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const ImportProjectsResourceForm = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportProjectsResourceForm
- ImportProjectsModal
```

--------------------------------------------------------------------------------

---[FILE: shared.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/import-modal/shared.tsx
Signals: React
Excerpt (<=80 chars):  export const validImportExtensions = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validImportExtensions
- disclaimer
- SupportedFormats
- ScanResultsTable
```

--------------------------------------------------------------------------------

---[FILE: encryption.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/invite-modal/encryption.ts
Signals: N/A
Excerpt (<=80 chars):  export function buildInviteByInstruction(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildInviteByInstruction
```

--------------------------------------------------------------------------------

---[FILE: invite-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/invite-modal/invite-form.tsx
Signals: React
Excerpt (<=80 chars):  export function getSearchParamsString(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSearchParamsString
- InviteForm
- EmailInput
```

--------------------------------------------------------------------------------

---[FILE: invite-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/invite-modal/invite-modal.tsx
Signals: React
Excerpt (<=80 chars):  export function getSearchParamsString(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSearchParamsString
- Permission
- OrganizationType
- FeatureStatus
- OrgFeatures
- Features
- OrganizationBranding
- Metadata
- OrganizationAuth0
```

--------------------------------------------------------------------------------

---[FILE: organization-member-roles-selector.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/invite-modal/organization-member-roles-selector.tsx
Signals: React
Excerpt (<=80 chars):  export interface Role {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationMemberRolesSelector
- Role
```

--------------------------------------------------------------------------------

---[FILE: blank-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/blank-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const BlankPane: FunctionComponent<Props> = ({ type }) => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: empty-state-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/empty-state-pane.tsx
Signals: React
Excerpt (<=80 chars): export const EmptyStatePane: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: grpc-request-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/grpc-request-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const canClientStream = (methodType?: GrpcMethodType) => methodType =...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- canClientStream
- GrpcMethodTypeName
```

--------------------------------------------------------------------------------

---[FILE: grpc-response-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/grpc-response-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const GrpcResponsePane: FunctionComponent<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: no-project-view.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/no-project-view.tsx
Signals: React
Excerpt (<=80 chars):  export const NoProjectView: FC<Props> = ({ storageRules, isGitSyncEnabled })...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: no-selected-project-view.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/no-selected-project-view.tsx
Signals: React
Excerpt (<=80 chars):  export const NoSelectedProjectView: FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/pane.tsx
Signals: React
Excerpt (<=80 chars):  export const Pane: FC<PropsWithChildren<PaneProps>> = ({ className, type, ch...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- paneBodyClasses
```

--------------------------------------------------------------------------------

---[FILE: placeholder-request-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/placeholder-request-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const PlaceholderRequestPane: FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: placeholder-response-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/placeholder-response-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const PlaceholderResponsePane: FC<PropsWithChildren<{}>> = ({ childre...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: request-group-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/request-group-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const RequestGroupPane: FC<{ settings: Settings }> = ({ settings }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: request-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/request-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const RequestPane: FC<Props> = ({ environmentId, settings, onPaste })...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: request-test-result-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/request-test-result-pane.tsx
Signals: React
Excerpt (<=80 chars):  export interface RequestTestResultRowsProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestTestResultRowsProps
```

--------------------------------------------------------------------------------

---[FILE: response-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/response-pane.tsx
Signals: React
Excerpt (<=80 chars): export const ResponsePane: FC<Props> = ({ activeRequestId }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: runner-result-history-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/runner-result-history-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const RunnerResultHistoryPane: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: runner-test-result-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/panes/runner-test-result-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const RunnerTestResultPane: FC<Props> = ({ result }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: git-repo-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/git-repo-form.tsx
Signals: React
Excerpt (<=80 chars):  export const GitRepoForm: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: git-repo-scan-result.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/git-repo-scan-result.tsx
Signals: React
Excerpt (<=80 chars):  export const GitRepoScanResult: FC<Props> = ({ initCloneGitRepositoryFetcher...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: project-create-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/project-create-form.tsx
Signals: React
Excerpt (<=80 chars):  export const ProjectCreateForm: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: project-empty-view.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/project-empty-view.tsx
Signals: React
Excerpt (<=80 chars):  export const ProjectEmptyView: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: project-settings-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/project-settings-form.tsx
Signals: React
Excerpt (<=80 chars):  export const ProjectSettingsForm: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: project-type-select.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/project-type-select.tsx
Signals: React
Excerpt (<=80 chars): export const ProjectTypeSelect = ({ value, onChange, storageRules }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectTypeSelect
```

--------------------------------------------------------------------------------

---[FILE: project-type-warning.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/project-type-warning.tsx
Signals: N/A
Excerpt (<=80 chars): export const ProjectTypeWarning = ({ isGitSyncEnabled, storageType, storageRu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectTypeWarning
```

--------------------------------------------------------------------------------

---[FILE: utils.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/project/utils.tsx
Signals: React
Excerpt (<=80 chars): export type ActiveView = 'project' | 'git-results';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useActiveView
- ActiveView
- ProjectType
- ProjectData
```

--------------------------------------------------------------------------------

---[FILE: proto-file-list.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/proto-file/proto-file-list.tsx
Signals: React
Excerpt (<=80 chars):  export type SelectProtoFileHandler = (id: string) => void;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectProtoFileHandler
- DeleteProtoFileHandler
- DeleteProtoDirectoryHandler
- UpdateProtoFileHandler
- RenameProtoFileHandler
- ExpandedProtoDirectory
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/rjsf/index.tsx
Signals: React
Excerpt (<=80 chars):  export interface InsomniaRjsfFormProps extends Omit<FormProps, 'onChange' | ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsomniaRjsfForm
- InsomniaRjsfFormProps
- InsomniaRjsfFormHandle
```

--------------------------------------------------------------------------------

---[FILE: ai-settings.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/ai-settings.tsx
Signals: React
Excerpt (<=80 chars):  export const AISettings = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AISettings
```

--------------------------------------------------------------------------------

---[FILE: boolean-setting.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/boolean-setting.tsx
Signals: React
Excerpt (<=80 chars):  export const BooleanSetting: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: cloud-service-credentials.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/cloud-service-credentials.tsx
Signals: React
Excerpt (<=80 chars):  export const CloudServiceCredentialList = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CloudServiceCredentialList
```

--------------------------------------------------------------------------------

---[FILE: create-plugin-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/create-plugin-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const CreatePluginModal = ({ onClose, onComplete }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreatePluginModal
```

--------------------------------------------------------------------------------

---[FILE: enum-setting.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/enum-setting.tsx
Signals: React
Excerpt (<=80 chars):  export const EnumSetting = <T extends string | number>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnumSetting
```

--------------------------------------------------------------------------------

---[FILE: general.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/general.tsx
Signals: React
Excerpt (<=80 chars):  export const General: FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: import-export.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/import-export.tsx
Signals: React
Excerpt (<=80 chars):  export type SelectedFormat = typeof VALUE_HAR | typeof VALUE_YAML;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- exportProjectToFile
- exportMockServerToFile
- exportGlobalEnvironmentToFile
- exportRequestsToFile
- SelectedFormat
```

--------------------------------------------------------------------------------

---[FILE: masked-setting.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/masked-setting.tsx
Signals: React
Excerpt (<=80 chars):  export const MaskedSetting: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: number-setting.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/number-setting.tsx
Signals: React
Excerpt (<=80 chars): export function snapNumberToLimits(value: number, min?: number, max?: number) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- snapNumberToLimits
```

--------------------------------------------------------------------------------

---[FILE: plugins.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/plugins.tsx
Signals: React
Excerpt (<=80 chars):  export const Plugins: FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: shortcuts.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/shortcuts.tsx
Signals: React
Excerpt (<=80 chars):  export const isKeyCombinationInRegistry = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isKeyCombinationInRegistry
```

--------------------------------------------------------------------------------

---[FILE: text-array-setting.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/text-array-setting.tsx
Signals: React
Excerpt (<=80 chars):  export const TextArraySetting: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: text-setting.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/text-setting.tsx
Signals: React
Excerpt (<=80 chars):  export const TextSetting: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: theme-panel.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/theme-panel.tsx
Signals: React
Excerpt (<=80 chars):  export const ThemePanel: FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: vault-key-panel.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/vault-key-panel.tsx
Signals: React
Excerpt (<=80 chars):  export const VaultKeyDisplayInput = ({ vaultKey }: { vaultKey: string }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VaultKeyDisplayInput
- VaultKeyPanel
```

--------------------------------------------------------------------------------

---[FILE: claude.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/llms/claude.tsx
Signals: React
Excerpt (<=80 chars): export const Claude = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Claude
```

--------------------------------------------------------------------------------

---[FILE: gemini.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/llms/gemini.tsx
Signals: React
Excerpt (<=80 chars):  export const Gemini = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gemini
```

--------------------------------------------------------------------------------

---[FILE: gguf.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/llms/gguf.tsx
Signals: React, Zod
Excerpt (<=80 chars):  export const GGUF = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GGUF
```

--------------------------------------------------------------------------------

---[FILE: openai.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/settings/llms/openai.tsx
Signals: React
Excerpt (<=80 chars):  export const OpenAI = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAI
```

--------------------------------------------------------------------------------

---[FILE: body-tab-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/socket-io/body-tab-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const SocketIOBodyTabPane = ({ request, requestPayload, environmentId...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SocketIOBodyTabPane
- SocketIOBodyContent
```

--------------------------------------------------------------------------------

---[FILE: event-tab-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/socket-io/event-tab-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const SocketIOEventTabPane = ({ request, eventListeners }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SocketIOEventTabPane
```

--------------------------------------------------------------------------------

---[FILE: event-view.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/socket-io/event-view.tsx
Signals: React
Excerpt (<=80 chars):  export const MessageEventView: FC<Props<SocketIOMessageEvent>> = ({ event })...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: request-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/socket-io/request-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const SocketIORequestPane: FC<Props> = ({ environment }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: tab-list.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/tabs/tab-list.tsx
Signals: React
Excerpt (<=80 chars):  export interface OrganizationTabs {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationTabList
- OrganizationTabs
```

--------------------------------------------------------------------------------

---[FILE: tab.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/tabs/tab.tsx
Signals: React
Excerpt (<=80 chars):  export type TabType =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsomniaTab
- TabType
- BaseTab
```

--------------------------------------------------------------------------------

---[FILE: grpc-status-tag.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/tags/grpc-status-tag.tsx
Signals: React
Excerpt (<=80 chars):  export const GrpcStatusTag: FC<Props> = memo(({ statusMessage, statusCode, s...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: grpc-tag.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/tags/grpc-tag.tsx
Signals: N/A
Excerpt (<=80 chars): export const GrpcTag = () => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GrpcTag
```

--------------------------------------------------------------------------------

---[FILE: method-tag.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/tags/method-tag.tsx
Signals: React
Excerpt (<=80 chars):  export const getMethodShortHand = (doc: Request) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatMethodName
- getMethodShortHand
- getRequestMethodShortHand
```

--------------------------------------------------------------------------------

````
