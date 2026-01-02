---
source_txt: fullstack_samples/insomnia-develop
converted_utc: 2025-12-18T10:36:55Z
part: 5
parts_total: 10
---

# FULLSTACK CODE DATABASE SAMPLES insomnia-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 5 of 10)

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

---[FILE: types.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Team {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RESOLUTION_SOURCE
- DocumentKey
- BlobId
- SnapshotState
- SnapshotStateMap
- SnapshotId
- StageEntry
- ResolutionSource
- Stage
- StatusCandidateMap
- Team
- BackendProject
- Head
- SnapshotStateEntry
- Snapshot
- Branch
- StageEntryDelete
- StageEntryAdd
```

--------------------------------------------------------------------------------

---[FILE: diff.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/delta/diff.ts
Signals: N/A
Excerpt (<=80 chars):  export type Operation = InsertOperation | CopyOperation;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- diff
- __internal
- Operation
```

--------------------------------------------------------------------------------

---[FILE: patch.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/delta/patch.ts
Signals: N/A
Excerpt (<=80 chars):  export function patch(a: string, operations: Operation[]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- patch
```

--------------------------------------------------------------------------------

---[FILE: fs-client.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/fs-client.ts
Signals: N/A
Excerpt (<=80 chars): export const fsClient = (basePath: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fsClient
```

--------------------------------------------------------------------------------

---[FILE: git-vcs.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/git-vcs.ts
Signals: N/A
Excerpt (<=80 chars): export const GitVCSOperationErrors = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitVCSOperationErrors
- GIT_CLONE_DIR
- GIT_INSOMNIA_DIR_NAME
- GIT_INTERNAL_DIR
- GIT_INSOMNIA_DIR
- GitVCS
- MergeConflictError
- GitHash
- GitRef
- HeadStatus
- WorkdirStatus
- StageStatus
- Status
- GitFileStatus
- GitFileStatusSymbol
- GitTimestamp
- GitLogEntry
- GitStatusWithIntelligentDiff
```

--------------------------------------------------------------------------------

---[FILE: insomnia-filename.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/insomnia-filename.ts
Signals: N/A
Excerpt (<=80 chars): export function safeToUseInsomniaFileName(fileName: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- safeToUseInsomniaFileName
- safeToUseInsomniaFileNameWithExt
```

--------------------------------------------------------------------------------

---[FILE: mem-client.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/mem-client.ts
Signals: N/A
Excerpt (<=80 chars): export class MemClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemClient
```

--------------------------------------------------------------------------------

---[FILE: ne-db-client.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/ne-db-client.ts
Signals: N/A
Excerpt (<=80 chars): export class NeDBClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NeDBClient
```

--------------------------------------------------------------------------------

---[FILE: path-sep.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/path-sep.ts
Signals: N/A
Excerpt (<=80 chars):  export function convertToPosixSep(filePath: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertToPosixSep
- convertToOsSep
```

--------------------------------------------------------------------------------

---[FILE: project-ne-db-client.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/project-ne-db-client.ts
Signals: N/A
Excerpt (<=80 chars): export class GitProjectNeDBClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitProjectNeDBClient
```

--------------------------------------------------------------------------------

---[FILE: project-routable-fs-client.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/project-routable-fs-client.ts
Signals: N/A
Excerpt (<=80 chars):  export type WriteFileMap = Record<string, string>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- projectRoutableFSClient
- WriteFileMap
```

--------------------------------------------------------------------------------

---[FILE: routable-fs-client.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/routable-fs-client.ts
Signals: N/A
Excerpt (<=80 chars): export function routableFSClient(defaultFS: git.PromiseFsClient, otherFS: Rec...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routableFSClient
```

--------------------------------------------------------------------------------

---[FILE: shallow-clone.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/shallow-clone.ts
Signals: N/A
Excerpt (<=80 chars): export const shallowClone = async ({ fsClient, gitRepository, ref }: Options)...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shallowClone
```

--------------------------------------------------------------------------------

---[FILE: system-error.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/system-error.ts
Signals: N/A
Excerpt (<=80 chars): export class SystemError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SystemError
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/git/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const addDotGit = (url: string): string => (url.endsWith('.git') ? ur...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addDotGit
- getAuthorFromGitRepository
- getOauth2FormatName
- gitCallbacks
```

--------------------------------------------------------------------------------

---[FILE: deterministic-stringify.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/lib/deterministic-stringify.ts
Signals: N/A
Excerpt (<=80 chars): export function deterministicStringify(value: any) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- deterministicStringify
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/store/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type HookFn = (extension: string, value: Buffer) => Promise<Buffer>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HookFn
- Hook
```

--------------------------------------------------------------------------------

---[FILE: base.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/store/drivers/base.ts
Signals: N/A
Excerpt (<=80 chars): export interface BaseDriver {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseDriver
```

--------------------------------------------------------------------------------

---[FILE: initialize-backend-project.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/vcs/initialize-backend-project.ts
Signals: N/A
Excerpt (<=80 chars):  export const initializeLocalBackendProjectAndMarkForSync = async ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initializeLocalBackendProjectAndMarkForSync
- pushSnapshotOnInitialize
```

--------------------------------------------------------------------------------

---[FILE: insomnia-sync.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/vcs/insomnia-sync.ts
Signals: N/A
Excerpt (<=80 chars):  export class UserAbortResolveMergeConflictError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VCSInstance
- UserAbortResolveMergeConflictError
```

--------------------------------------------------------------------------------

---[FILE: migrate-projects-into-organization.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/vcs/migrate-projects-into-organization.ts
Signals: N/A
Excerpt (<=80 chars):  export const shouldMigrateProjectUnderOrganization = async () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shouldMigrateProjectUnderOrganization
- migrateProjectsIntoOrganization
```

--------------------------------------------------------------------------------

---[FILE: normalize-backend-project-team.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/vcs/normalize-backend-project-team.ts
Signals: N/A
Excerpt (<=80 chars):  export interface BackendProjectWithTeams extends BackendProject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- normalizeBackendProjectTeam
- BackendProjectWithTeams
- BackendProjectWithTeam
```

--------------------------------------------------------------------------------

---[FILE: pull-backend-project.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/vcs/pull-backend-project.ts
Signals: N/A
Excerpt (<=80 chars):  export const pullBackendProject = async ({ vcs, backendProject, remoteProjec...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pullBackendProject
```

--------------------------------------------------------------------------------

---[FILE: util.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/vcs/util.ts
Signals: N/A
Excerpt (<=80 chars):  export function generateSnapshotStateMap(snapshot: Snapshot | null): Snapsho...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateSnapshotStateMap
- generateStateMap
- generateCandidateMap
- threeWayMerge
- compareBranches
- stateDelta
- getStagable
- getRootSnapshot
- preMergeCheck
- hash
- hashDocument
- updateStateWithConflictResolutions
- interceptAccessError
```

--------------------------------------------------------------------------------

---[FILE: vcs.ts]---
Location: insomnia-develop/packages/insomnia/src/sync/vcs/vcs.ts
Signals: N/A
Excerpt (<=80 chars): export function chunkArray<T>(arr: T[], chunkSize: number) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VCS
```

--------------------------------------------------------------------------------

---[FILE: base-extension-worker.ts]---
Location: insomnia-develop/packages/insomnia/src/templating/base-extension-worker.ts
Signals: N/A
Excerpt (<=80 chars):  export function decodeEncoding<T>(value: T) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fetchFromTemplateWorkerDatabase
```

--------------------------------------------------------------------------------

---[FILE: faker-functions.ts]---
Location: insomnia-develop/packages/insomnia/src/templating/faker-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const fakerFunctions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fakerFunctions
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia/src/templating/index.ts
Signals: N/A
Excerpt (<=80 chars): export const NUNJUCKS_TEMPLATE_GLOBAL_PROPERTY_NAME = '_';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- render
- reload
- NUNJUCKS_TEMPLATE_GLOBAL_PROPERTY_NAME
```

--------------------------------------------------------------------------------

---[FILE: render-error.ts]---
Location: insomnia-develop/packages/insomnia/src/templating/render-error.ts
Signals: N/A
Excerpt (<=80 chars): export class RenderError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractUndefinedVariableKey
- RenderError
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: insomnia-develop/packages/insomnia/src/templating/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type RenderPurpose = 'send' | 'general' | 'preview' | 'script' | 'no-...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenderPurpose
- PluginToMainAPIPaths
- RenderedRequest
- HandleRender
- RenderContextAncestor
- RenderContextOptions
- NunjucksTagContextMenuAction
- PluginArgumentValue
- DisplayName
- PluginArgumentEnum
- PluginArgumentModel
- PluginArgumentString
- PluginArgumentBoolean
- PluginArgumentFile
- PluginArgumentNumber
- PluginArgument
- RenderContextAndKeys
- BaseRenderContextOptions
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: insomnia-develop/packages/insomnia/src/templating/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function getKeys(obj: any, prefix = ''): { name: string; value: any }[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getKeys
- forceBracketNotation
- normalizeToDotAndBracketNotation
- tokenizeTag
- unTokenizeTag
- getDefaultFill
- extractNunjucksTagFromCoords
- responseTagRegex
```

--------------------------------------------------------------------------------

---[FILE: worker.ts]---
Location: insomnia-develop/packages/insomnia/src/templating/worker.ts
Signals: N/A
Excerpt (<=80 chars): export const NUNJUCKS_TEMPLATE_GLOBAL_PROPERTY_NAME = '_';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- render
- reload
- NUNJUCKS_TEMPLATE_GLOBAL_PROPERTY_NAME
```

--------------------------------------------------------------------------------

---[FILE: analytics.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/analytics.ts
Signals: N/A
Excerpt (<=80 chars): export function vcsSegmentEventProperties(type: 'git', action: VCSAction, err...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vcsSegmentEventProperties
```

--------------------------------------------------------------------------------

---[FILE: auth-session-provider.client.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/auth-session-provider.client.ts
Signals: N/A
Excerpt (<=80 chars):  export function getLoginUrl() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLoginUrl
```

--------------------------------------------------------------------------------

---[FILE: constant.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/constant.ts
Signals: N/A
Excerpt (<=80 chars):  export const INSOMNIA_TAB_HEIGHT = 40;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INSOMNIA_TAB_HEIGHT
```

--------------------------------------------------------------------------------

---[FILE: event-bus.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/event-bus.ts
Signals: N/A
Excerpt (<=80 chars):  export const OAUTH2_AUTHORIZATION_STATUS_CHANGE = 'OAUTH2_AUTHORIZATION_STAT...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAUTH2_AUTHORIZATION_STATUS_CHANGE
```

--------------------------------------------------------------------------------

---[FILE: insomnia-fetch.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/insomnia-fetch.ts
Signals: N/A
Excerpt (<=80 chars):  export class ResponseFailError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResponseFailError
```

--------------------------------------------------------------------------------

---[FILE: organization-utils.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/organization-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function sortOrganizations(accountId: string, organizations: Organiza...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sortOrganizations
- DEFAULT_STORAGE_RULES
- syncProjects
```

--------------------------------------------------------------------------------

---[FILE: sentry.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/sentry.ts
Signals: N/A
Excerpt (<=80 chars):  export function initializeSentry() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initializeSentry
```

--------------------------------------------------------------------------------

---[FILE: sync-utils.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/sync-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function vcsSegmentEventProperties(type: 'remote', action: VCSAction,...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vcsSegmentEventProperties
```

--------------------------------------------------------------------------------

---[FILE: vault-key.client.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/vault-key.client.ts
Signals: N/A
Excerpt (<=80 chars):  export const vaultKeyParams = params[2048];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vaultKeyParams
- saveVaultKey
- createVaultKey
- validateVaultKey
```

--------------------------------------------------------------------------------

---[FILE: app-loading-indicator.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/app-loading-indicator.tsx
Signals: N/A
Excerpt (<=80 chars): export const AppLoadingIndicator = () => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppLoadingIndicator
```

--------------------------------------------------------------------------------

---[FILE: avatar.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/avatar.tsx
Signals: React
Excerpt (<=80 chars):  export const Avatar = ({ src, alt, size = 'medium' }: { src: string; alt: st...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Avatar
- AvatarGroup
```

--------------------------------------------------------------------------------

---[FILE: check-for-updates-button.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/check-for-updates-button.tsx
Signals: React
Excerpt (<=80 chars):  export const CheckForUpdatesButton = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckForUpdatesButton
```

--------------------------------------------------------------------------------

---[FILE: command-palette.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/command-palette.tsx
Signals: React
Excerpt (<=80 chars):  export const CommandPalette = memo(function CommandPalette({ style = {} }: {...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommandPalette
```

--------------------------------------------------------------------------------

---[FILE: design-empty-state.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/design-empty-state.tsx
Signals: React
Excerpt (<=80 chars):  export const DesignEmptyState: FC<Props> = ({ onImport }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: diff-view-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/diff-view-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const DiffEditor = ({ original, modified }: { original: string; modif...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiffEditor
```

--------------------------------------------------------------------------------

---[FILE: document-tab.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/document-tab.tsx
Signals: N/A
Excerpt (<=80 chars):  export const DocumentTab = ({ organizationId, projectId, workspaceId, classN...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DocumentTab
```

--------------------------------------------------------------------------------

---[FILE: editable-input.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editable-input.tsx
Signals: React
Excerpt (<=80 chars):  export const EditableInput = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditableInput
```

--------------------------------------------------------------------------------

---[FILE: encoding-picker.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/encoding-picker.tsx
Signals: N/A
Excerpt (<=80 chars):  export const EncodingPicker = ({ encoding, onChange }: { encoding: string; o...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EncodingPicker
```

--------------------------------------------------------------------------------

---[FILE: environment-picker.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/environment-picker.tsx
Signals: React
Excerpt (<=80 chars):  export const EnvironmentPicker = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnvironmentPicker
```

--------------------------------------------------------------------------------

---[FILE: error-boundary.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/error-boundary.tsx
Signals: React
Excerpt (<=80 chars):  export const ErrorBoundary = (props: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorBoundary
```

--------------------------------------------------------------------------------

---[FILE: example-openapi-specs.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/example-openapi-specs.ts
Signals: N/A
Excerpt (<=80 chars): export const petStoreSpec = `openapi: 3.0.4

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- petStoreSpec
- todoSpec
- blankSpec
```

--------------------------------------------------------------------------------

---[FILE: github-app-config-link.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/github-app-config-link.tsx
Signals: N/A
Excerpt (<=80 chars):  export function isGitHubAppUserToken(token?: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isGitHubAppUserToken
- ConfigLink
```

--------------------------------------------------------------------------------

---[FILE: github-stars-button.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/github-stars-button.tsx
Signals: React
Excerpt (<=80 chars):  export const GitHubStarsButton = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitHubStarsButton
```

--------------------------------------------------------------------------------

---[FILE: header-invite-button.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/header-invite-button.tsx
Signals: React
Excerpt (<=80 chars):  export const HeaderInviteButton = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeaderInviteButton
```

--------------------------------------------------------------------------------

---[FILE: header-plan-indicator.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/header-plan-indicator.tsx
Signals: React
Excerpt (<=80 chars):  export const HeaderPlanIndicator = ({ isMinimal }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeaderPlanIndicator
```

--------------------------------------------------------------------------------

---[FILE: header-user-button.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/header-user-button.tsx
Signals: N/A
Excerpt (<=80 chars): export const HeaderUserButton = ({ user, isMinimal = false }: UserButtonProps...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HeaderUserButton
```

--------------------------------------------------------------------------------

---[FILE: help-tooltip.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/help-tooltip.tsx
Signals: React
Excerpt (<=80 chars):  export const HelpTooltip: FC<Props> = props => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: hotkey.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/hotkey.tsx
Signals: React
Excerpt (<=80 chars):  export const Hotkey: FC<Props> = memo(({ keyCombination, keyBindings, classN...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: html-element-wrapper.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/html-element-wrapper.tsx
Signals: React
Excerpt (<=80 chars): export const HtmlElementWrapper: FC<Props> = ({ el, onUnmount }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: icon.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/icon.tsx
Signals: N/A
Excerpt (<=80 chars):  export const Icon = (props: FontAwesomeIconProps) => <FontAwesomeIcon {...pr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Icon
```

--------------------------------------------------------------------------------

---[FILE: insomnia-icon.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/insomnia-icon.tsx
Signals: N/A
Excerpt (<=80 chars): export const InsomniaLogo = ({ ...props }: {} & React.SVGProps<SVGSVGElement>...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsomniaLogo
```

--------------------------------------------------------------------------------

---[FILE: keydown-binder.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/keydown-binder.ts
Signals: React
Excerpt (<=80 chars):  export function useKeyboardShortcuts(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useKeyboardShortcuts
- useDocBodyKeyboardShortcuts
- createKeybindingsHandler
```

--------------------------------------------------------------------------------

---[FILE: markdown-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/markdown-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const MarkdownEditor = forwardRef<CodeEditorHandle, Props>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MarkdownEditor
```

--------------------------------------------------------------------------------

---[FILE: markdown-preview.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/markdown-preview.tsx
Signals: React
Excerpt (<=80 chars):  export const MarkdownPreview: FC<Props> = ({ markdown, heading }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: organization-avatar.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/organization-avatar.tsx
Signals: React
Excerpt (<=80 chars):  export const OrganizationAvatar = ({ src, alt }: { src: string; alt: string ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationAvatar
```

--------------------------------------------------------------------------------

---[FILE: password-input.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/password-input.tsx
Signals: React
Excerpt (<=80 chars):  export interface PasswordInputProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordInput
- PasswordInputProps
```

--------------------------------------------------------------------------------

---[FILE: present-users.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/present-users.tsx
Signals: N/A
Excerpt (<=80 chars):  export const PresentUsers = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PresentUsers
```

--------------------------------------------------------------------------------

---[FILE: rendered-query-string.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/rendered-query-string.tsx
Signals: React
Excerpt (<=80 chars):  export const RenderedQueryString: FC<Props> = ({ request }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: rendered-text.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/rendered-text.tsx
Signals: React
Excerpt (<=80 chars):  export const RenderedText: FC<Omit<Props, 'render'>> = props => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: request-url-bar.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/request-url-bar.tsx
Signals: React
Excerpt (<=80 chars):  export interface RequestUrlBarHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestUrlBar
- RequestUrlBarHandle
```

--------------------------------------------------------------------------------

---[FILE: response-timer.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/response-timer.tsx
Signals: React
Excerpt (<=80 chars):  export const ResponseTimer: FunctionComponent<Props> = ({ handleCancel, acti...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: svg-icon.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/svg-icon.tsx
Signals: React
Excerpt (<=80 chars):  export const ThemeEnum = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ThemeEnum
- IconEnum
- SvgIcon
- IconId
```

--------------------------------------------------------------------------------

---[FILE: time-from-now.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/time-from-now.tsx
Signals: React
Excerpt (<=80 chars):  export function getTimeFromNow(timestamp: string | number | Date, titleCase:...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTimeFromNow
```

--------------------------------------------------------------------------------

---[FILE: toast-notification.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/toast-notification.tsx
Signals: React
Excerpt (<=80 chars): export interface RAToastContent {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- queue
- showToast
- Toaster
- RAToastContent
```

--------------------------------------------------------------------------------

---[FILE: tooltip.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/tooltip.tsx
Signals: React
Excerpt (<=80 chars):  export const Tooltip = (props: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tooltip
```

--------------------------------------------------------------------------------

---[FILE: trail-lines-animation.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/trail-lines-animation.ts
Signals: React
Excerpt (<=80 chars): export const internals = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- animateTrailPaths
- internals
- random
```

--------------------------------------------------------------------------------

---[FILE: trail-lines-container.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/trail-lines-container.tsx
Signals: React
Excerpt (<=80 chars):  export const TrailLinesContainer = ({ children }: PropsWithChildren) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TrailLinesContainer
```

--------------------------------------------------------------------------------

---[FILE: trail-lines.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/trail-lines.tsx
Signals: React
Excerpt (<=80 chars): export interface TrailsLineHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TrailsLineHandle
```

--------------------------------------------------------------------------------

---[FILE: upgrade-notice.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/upgrade-notice.tsx
Signals: N/A
Excerpt (<=80 chars): export interface UpgradeNoticeProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpgradeNotice
- UpgradeNoticeProps
```

--------------------------------------------------------------------------------

---[FILE: code-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/.client/codemirror/code-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const shouldIndentWithTabs = ({ mode, indentWithTabs }: { mode?: stri...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shouldIndentWithTabs
- CodeEditor
- CodeEditorProps
- CodeEditorHandle
```

--------------------------------------------------------------------------------

---[FILE: merge-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/.client/codemirror/merge-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const MergeEditor = ({ leftContent, rightContent, centerContent, onCh...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeEditor
```

--------------------------------------------------------------------------------

---[FILE: normalize-irregular-whitespace.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/.client/codemirror/normalize-irregular-whitespace.ts
Signals: N/A
Excerpt (<=80 chars):  export function normalizeIrregularWhitespace(text: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- normalizeIrregularWhitespace
```

--------------------------------------------------------------------------------

---[FILE: one-line-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/.client/codemirror/one-line-editor.tsx
Signals: React
Excerpt (<=80 chars):  export interface OneLineEditorProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OneLineEditor
- OneLineEditorProps
- EditorEventListener
- OneLineEditorHandle
```

--------------------------------------------------------------------------------

---[FILE: nunjucks.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/.client/codemirror/modes/nunjucks.ts
Signals: N/A
Excerpt (<=80 chars):  export function isNunjucksMode(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isNunjucksMode
```

--------------------------------------------------------------------------------

---[FILE: IcnArrowRight.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnArrowRight.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnArrowRight = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnArrowRight
```

--------------------------------------------------------------------------------

---[FILE: IcnAzureLogo.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnAzureLogo.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnAzureLogo = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnAzureLogo
```

--------------------------------------------------------------------------------

---[FILE: IcnBitbucketLogo.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnBitbucketLogo.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnBitbucketLogo = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnBitbucketLogo
```

--------------------------------------------------------------------------------

---[FILE: IcnBrackets.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnBrackets.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnBrackets = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnBrackets
```

--------------------------------------------------------------------------------

---[FILE: IcnBug.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnBug.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnBug = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnBug
```

--------------------------------------------------------------------------------

---[FILE: IcnBurgerMenu.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnBurgerMenu.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnBurgerMenu = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnBurgerMenu
```

--------------------------------------------------------------------------------

---[FILE: IcnCheckmark.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnCheckmark.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnCheckmark = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnCheckmark
```

--------------------------------------------------------------------------------

---[FILE: IcnCheckmarkCircle.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnCheckmarkCircle.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnCheckmarkCircle = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnCheckmarkCircle
```

--------------------------------------------------------------------------------

---[FILE: IcnChevronDown.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnChevronDown.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnChevronDown = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnChevronDown
```

--------------------------------------------------------------------------------

---[FILE: IcnChevronUp.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/assets/svgr/IcnChevronUp.tsx
Signals: React
Excerpt (<=80 chars): export const SvgIcnChevronUp = memo<SVGProps<SVGSVGElement>>(props => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgIcnChevronUp
```

--------------------------------------------------------------------------------

````
