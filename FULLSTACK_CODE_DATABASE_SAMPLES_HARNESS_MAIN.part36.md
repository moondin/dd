---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 36
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 36 of 37)

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

---[FILE: LabelsListing.tsx]---
Location: harness-main/web/src/pages/Labels/LabelsListing.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelModal.tsx]---
Location: harness-main/web/src/pages/Labels/LabelModal/LabelModal.tsx
Signals: React
Excerpt (<=80 chars):  export const ColorSelectorDropdown = (props: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ColorSelectorDropdown
```

--------------------------------------------------------------------------------

---[FILE: LabelsHeader.tsx]---
Location: harness-main/web/src/pages/Labels/LabelsHeader/LabelsHeader.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManageRepositories.tsx]---
Location: harness-main/web/src/pages/ManageSpace/ManageRepositories/ManageRepositories.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SpacePullRequests.tsx]---
Location: harness-main/web/src/pages/ManageSpace/SpacePullRequests/SpacePullRequests.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PipelineList.tsx]---
Location: harness-main/web/src/pages/PipelineList/PipelineList.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequest.tsx]---
Location: harness-main/web/src/pages/PullRequest/PullRequest.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestMetaLine.tsx]---
Location: harness-main/web/src/pages/PullRequest/PullRequestMetaLine.tsx
Signals: React
Excerpt (<=80 chars):  export const PullRequestMetaLine: React.FC<PullRequestMetaLineProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestTabContentWrapper.tsx]---
Location: harness-main/web/src/pages/PullRequest/PullRequestTabContentWrapper.tsx
Signals: React
Excerpt (<=80 chars):  export const PullRequestTabContentWrapper: React.FC<PullRequestTabContentWra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestTitle.tsx]---
Location: harness-main/web/src/pages/PullRequest/PullRequestTitle.tsx
Signals: React
Excerpt (<=80 chars):  export const PullRequestTitle: React.FC<PullRequestTitleProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestUtils.tsx]---
Location: harness-main/web/src/pages/PullRequest/PullRequestUtils.tsx
Signals: N/A
Excerpt (<=80 chars):  export interface PRMergeOption extends SelectOption {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isCodeComment
- isComment
- isSystemComment
- getCombinedEvaluations
- getActivePullReqPageSection
- extractSpecificViolations
- generateReviewDecisionInfo
- checkEntries
- findWaitingDecisions
- findReviewDecisions
- processReviewDecision
- getUnifiedDefaultReviewersState
- getMergeOptions
- updateReviewDecisionPrincipal
- defaultReviewerResponseWithDecision
- extractInfoFromRuleViolationArr
- ReviewDecisionInfo
- ActivityLabel
```

--------------------------------------------------------------------------------

---[FILE: useGetPullRequestInfo.ts]---
Location: harness-main/web/src/pages/PullRequest/useGetPullRequestInfo.ts
Signals: React
Excerpt (<=80 chars): export function useGetPullRequestInfo() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGetPullRequestInfo
- usePullReqActivities
- pullReqAtom
- pullReqActivitiesAtom
- UseGetPullRequestInfoResult
```

--------------------------------------------------------------------------------

---[FILE: CheckPipelineStages.tsx]---
Location: harness-main/web/src/pages/PullRequest/Checks/CheckPipelineStages.tsx
Signals: React
Excerpt (<=80 chars):  export const CheckPipelineStages: React.FC<CheckPipelineStagesProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CheckPipelineSteps.tsx]---
Location: harness-main/web/src/pages/PullRequest/Checks/CheckPipelineSteps.tsx
Signals: React
Excerpt (<=80 chars):  export const CheckPipelineSteps: React.FC<CheckPipelineStepsProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLogLineElement
```

--------------------------------------------------------------------------------

---[FILE: Checks.tsx]---
Location: harness-main/web/src/pages/PullRequest/Checks/Checks.tsx
Signals: React
Excerpt (<=80 chars):  export const Checks: React.FC<ChecksProps> = ({ repoMetadata, pullReqMetadat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ChecksMenu.tsx]---
Location: harness-main/web/src/pages/PullRequest/Checks/ChecksMenu.tsx
Signals: React
Excerpt (<=80 chars): export const ChecksMenu: React.FC<ChecksMenuProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ChecksOverview.tsx]---
Location: harness-main/web/src/pages/PullRequest/Checks/ChecksOverview.tsx
Signals: React
Excerpt (<=80 chars):  export function ChecksOverview({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChecksOverview
```

--------------------------------------------------------------------------------

---[FILE: ChecksUtils.ts]---
Location: harness-main/web/src/pages/PullRequest/Checks/ChecksUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ChecksProps extends Pick<GitInfoProps, 'repoMetadata' | 'pu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractBetweenPipelinesAndExecutions
- parseLogString
- ChecksProps
- DetailDict
```

--------------------------------------------------------------------------------

---[FILE: CodeOwnersOverview.tsx]---
Location: harness-main/web/src/pages/PullRequest/CodeOwners/CodeOwnersOverview.tsx
Signals: React
Excerpt (<=80 chars):  export function CodeOwnersOverview({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeOwnersOverview
```

--------------------------------------------------------------------------------

---[FILE: CodeCommentHeader.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/CodeCommentHeader.tsx
Signals: React
Excerpt (<=80 chars):  export const CodeCommentHeader: React.FC<CodeCommentHeaderProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Conversation.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/Conversation.tsx
Signals: React
Excerpt (<=80 chars):  export interface ConversationProps extends Pick<GitInfoProps, 'repoMetadata'...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConversationProps
```

--------------------------------------------------------------------------------

---[FILE: DescriptionBox.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/DescriptionBox.tsx
Signals: React
Excerpt (<=80 chars):  export const DescriptionBox: React.FC<DescriptionBoxProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SystemComment.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/SystemComment.tsx
Signals: React
Excerpt (<=80 chars): export const SystemComment: React.FC<SystemCommentProps> = ({ pullReqMetadata...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: InlineMergeBox.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestActionsBox/InlineMergeBox.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestActionsBox.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestActionsBox/PullRequestActionsBox.tsx
Signals: React
Excerpt (<=80 chars):  export interface PullRequestActionsBoxProps extends Pick<GitInfoProps, 'repo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullRequestActionsBoxProps
```

--------------------------------------------------------------------------------

---[FILE: CommandLineInfo.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/CommandLineInfo.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestOverviewPanel.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/PullRequestOverviewPanel.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestPanelSections.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/PullRequestPanelSections.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: BranchActionsSection.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/BranchActionsSection.tsx
Signals: React
Excerpt (<=80 chars):  export const BranchActionsButton = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BranchActionsButton
```

--------------------------------------------------------------------------------

---[FILE: ChangesSection.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/ChangesSection.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ChecksSection.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/ChecksSection.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CommentsSection.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/CommentsSection.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MergeSection.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/MergeSection.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RebaseSourceSection.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/RebaseSourceSection.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ReviewersPanel.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/ReviewersPanel.tsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo } from 'react'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: StatusCircle.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestOverviewPanel/sections/StatusCircle.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestSideBar.tsx]---
Location: harness-main/web/src/pages/PullRequest/Conversation/PullRequestSideBar/PullRequestSideBar.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DefaultReviewersPanel.tsx]---
Location: harness-main/web/src/pages/PullRequest/DefaultReviewers/DefaultReviewersPanel.tsx
Signals: React
Excerpt (<=80 chars):  export const DefaultReviewersPanel: React.FC<DefaultReviewersPanelProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestCommits.tsx]---
Location: harness-main/web/src/pages/PullRequest/PullRequestCommits/PullRequestCommits.tsx
Signals: React
Excerpt (<=80 chars):  export const PullRequestCommits: React.FC<PullRequestCommitsProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequests.tsx]---
Location: harness-main/web/src/pages/PullRequests/PullRequests.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SpacePullRequestsListing.tsx]---
Location: harness-main/web/src/pages/PullRequests/SpacePullRequestsListing.tsx
Signals: React
Excerpt (<=80 chars):  export function SpacePullRequestsListing() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpacePullRequestsListing
```

--------------------------------------------------------------------------------

---[FILE: PRAuthorFilter.tsx]---
Location: harness-main/web/src/pages/PullRequests/PullRequestsContentHeader/PRAuthorFilter.tsx
Signals: React
Excerpt (<=80 chars):  export function PRAuthorFilter({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PRAuthorFilter
```

--------------------------------------------------------------------------------

---[FILE: PullRequestsContentHeader.tsx]---
Location: harness-main/web/src/pages/PullRequests/PullRequestsContentHeader/PullRequestsContentHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function PullRequestsContentHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PullRequestsContentHeader
```

--------------------------------------------------------------------------------

---[FILE: SpacePullRequestsContentHeader.tsx]---
Location: harness-main/web/src/pages/PullRequests/PullRequestsContentHeader/SpacePullRequestsContentHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function SpacePullRequestsContentHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpacePullRequestsContentHeader
```

--------------------------------------------------------------------------------

---[FILE: RepositoriesListing.tsx]---
Location: harness-main/web/src/pages/RepositoriesListing/RepositoriesListing.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FeatureMap.tsx]---
Location: harness-main/web/src/pages/RepositoriesListing/FeatureMap/FeatureMap.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EmptyRepositoryInfo.tsx]---
Location: harness-main/web/src/pages/Repository/EmptyRepositoryInfo.tsx
Signals: React
Excerpt (<=80 chars):  export const EmptyRepositoryInfo: React.FC<Pick<GitInfoProps, 'repoMetadata'...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Repository.tsx]---
Location: harness-main/web/src/pages/Repository/Repository.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryContent.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/RepositoryContent.tsx
Signals: React
Excerpt (<=80 chars):  export function RepositoryContent({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryContent
```

--------------------------------------------------------------------------------

---[FILE: ContentHeader.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/ContentHeader/ContentHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function ContentHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContentHeader
```

--------------------------------------------------------------------------------

---[FILE: FileContent.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/FileContent/FileContent.tsx
Signals: React
Excerpt (<=80 chars):  export function FileContent({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileContent
```

--------------------------------------------------------------------------------

---[FILE: GitBlame.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/FileContent/GitBlame.tsx
Signals: React
Excerpt (<=80 chars):  export const GitBlame: React.FC<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: lineWidget.ts]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/FileContent/lineWidget.ts
Signals: N/A
Excerpt (<=80 chars):  export interface LineWidgetSpec {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LineWidgetGeneration
- LineWidgetSpec
```

--------------------------------------------------------------------------------

---[FILE: RenameContentHistory.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/FileContent/RenameContentHistory.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FolderContent.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/FolderContent/FolderContent.tsx
Signals: React
Excerpt (<=80 chars): export function FolderContent({ repoMetadata, resourceContent, gitRef, resour...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderContent
```

--------------------------------------------------------------------------------

---[FILE: Readme.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/FolderContent/Readme.tsx
Signals: React
Excerpt (<=80 chars):  export const Readme = React.memo(ReadmeViewer)

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Readme
```

--------------------------------------------------------------------------------

---[FILE: RepositorySummary.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryContent/FolderContent/RepositorySummary/RepositorySummary.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryHeader.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryHeader/RepositoryHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function RepositoryHeader(props: RepositoryHeaderProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryHeader
```

--------------------------------------------------------------------------------

---[FILE: demodata.ts]---
Location: harness-main/web/src/pages/Repository/RepositoryTree/demodata.ts
Signals: N/A
Excerpt (<=80 chars): export const sampleTree = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sampleTree
```

--------------------------------------------------------------------------------

---[FILE: renderers.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryTree/renderers.tsx
Signals: React
Excerpt (<=80 chars):  export const renderers: TreeRenderProps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ResourceTree.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryTree/ResourceTree.tsx
Signals: React
Excerpt (<=80 chars):  export function ResourceTree() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResourceTree
```

--------------------------------------------------------------------------------

---[FILE: TreeExample.tsx]---
Location: harness-main/web/src/pages/Repository/RepositoryTree/TreeExample.tsx
Signals: React
Excerpt (<=80 chars):  export const TreeExample = (): JSX.Element => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TreeExample
```

--------------------------------------------------------------------------------

---[FILE: RepositoryBranches.tsx]---
Location: harness-main/web/src/pages/RepositoryBranches/RepositoryBranches.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryBranchesContent.tsx]---
Location: harness-main/web/src/pages/RepositoryBranches/RepositoryBranchesContent/RepositoryBranchesContent.tsx
Signals: React
Excerpt (<=80 chars):  export function RepositoryBranchesContent({ repoMetadata }: Partial<Pick<Git...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryBranchesContent
```

--------------------------------------------------------------------------------

---[FILE: BranchesContent.tsx]---
Location: harness-main/web/src/pages/RepositoryBranches/RepositoryBranchesContent/BranchesContent/BranchesContent.tsx
Signals: React
Excerpt (<=80 chars):  export function BranchesContent({ repoMetadata, searchTerm = '', branches, o...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BranchesContent
```

--------------------------------------------------------------------------------

---[FILE: BranchesContentHeader.tsx]---
Location: harness-main/web/src/pages/RepositoryBranches/RepositoryBranchesContent/BranchesContentHeader/BranchesContentHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function BranchesContentHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BranchesContentHeader
```

--------------------------------------------------------------------------------

---[FILE: RepositoryCommit.tsx]---
Location: harness-main/web/src/pages/RepositoryCommit/RepositoryCommit.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryCommits.tsx]---
Location: harness-main/web/src/pages/RepositoryCommits/RepositoryCommits.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryFileEdit.tsx]---
Location: harness-main/web/src/pages/RepositoryFileEdit/RepositoryFileEdit.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FileEditor.tsx]---
Location: harness-main/web/src/pages/RepositoryFileEdit/FileEditor/FileEditor.tsx
Signals: React
Excerpt (<=80 chars):  export const FileEditor = React.memo(Editor)

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileEditor
```

--------------------------------------------------------------------------------

---[FILE: RepositoryFileEditHeader.tsx]---
Location: harness-main/web/src/pages/RepositoryFileEdit/RepositoryFileEditHeader/RepositoryFileEditHeader.tsx
Signals: React
Excerpt (<=80 chars):  export const RepositoryFileEditHeader: React.FC<RepositoryFileEditHeaderProp...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositorySettings.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/RepositorySettings.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SettingsContent.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/SettingsContent.tsx
Signals: React
Excerpt (<=80 chars):  export function SettingsContent({ hooks }: SettingsContentProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsContent
```

--------------------------------------------------------------------------------

---[FILE: GeneralSettingsContent.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/GeneralSettingsContent/GeneralSettingsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArchiveRepoModal.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/GeneralSettingsContent/ArchiveRepoModal/ArchiveRepoModal.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DefaultBranchModal.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/GeneralSettingsContent/DefaultBranchModal/DefaultBranchModal.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeleteRepoModal.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/GeneralSettingsContent/DeleteRepoModal/DeleteRepoModal.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositorySettingsContent.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/RepossitorySettingsContent/RepositorySettingsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SecurityScanSettings.tsx]---
Location: harness-main/web/src/pages/RepositorySettings/SecurityScanSettings/SecurityScanSettings.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryTags.tsx]---
Location: harness-main/web/src/pages/RepositoryTags/RepositoryTags.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryTagsContent.tsx]---
Location: harness-main/web/src/pages/RepositoryTags/RepositoryTagsContent/RepositoryTagsContent.tsx
Signals: React
Excerpt (<=80 chars):  export function RepositoryTagsContent({ repoMetadata }: Pick<GitInfoProps, '...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryTagsContent
```

--------------------------------------------------------------------------------

---[FILE: RepositoryTagsContentHeader.tsx]---
Location: harness-main/web/src/pages/RepositoryTags/RepositoryTagsContentHeader/RepositoryTagsContentHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function RepositoryTagsContentHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryTagsContentHeader
```

--------------------------------------------------------------------------------

---[FILE: TagsContent.tsx]---
Location: harness-main/web/src/pages/RepositoryTags/TagsContent/TagsContent.tsx
Signals: React
Excerpt (<=80 chars):  export function TagsContent({ repoMetadata, searchTerm = '', branches, onDel...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagsContent
```

--------------------------------------------------------------------------------

---[FILE: CodeSearchPage.tsx]---
Location: harness-main/web/src/pages/Search/CodeSearchPage.tsx
Signals: React
Excerpt (<=80 chars):  export const SearchResult = ({ fileMatch, searchTerm }: { fileMatch: FileMat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchResult
- SemanticSearchResult
```

--------------------------------------------------------------------------------

---[FILE: CodeSearchPage.types.ts]---
Location: harness-main/web/src/pages/Search/CodeSearchPage.types.ts
Signals: N/A
Excerpt (<=80 chars): export interface KeywordSearchResponse {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeywordSearchResponse
- FileMatch
- Match
- Fragment
- Stats
```

--------------------------------------------------------------------------------

---[FILE: KeywordSearchFilters.tsx]---
Location: harness-main/web/src/pages/Search/KeywordSearchFilters.tsx
Signals: React
Excerpt (<=80 chars): import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Search.tsx]---
Location: harness-main/web/src/pages/Search/Search.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Secret.tsx]---
Location: harness-main/web/src/pages/Secret/Secret.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SecretList.tsx]---
Location: harness-main/web/src/pages/SecretList/SecretList.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SecretFormInput.tsx]---
Location: harness-main/web/src/pages/SecretList/components/SecretFormInput/SecretFormInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useGetSecretList.tsx]---
Location: harness-main/web/src/pages/SecretList/hooks/useGetSecretList.tsx
Signals: N/A
Excerpt (<=80 chars):  export function useGetSecretList({ space, queryParams }: useGetSecretListPro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGetSecretList
```

--------------------------------------------------------------------------------

---[FILE: Settings.tsx]---
Location: harness-main/web/src/pages/Settings/Settings.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SignIn.tsx]---
Location: harness-main/web/src/pages/SignIn/SignIn.tsx
Signals: React
Excerpt (<=80 chars):  export const SignIn: React.FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SignUp.tsx]---
Location: harness-main/web/src/pages/SignUp/SignUp.tsx
Signals: React
Excerpt (<=80 chars):  export const SignUp: React.FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SpaceAccessControl.tsx]---
Location: harness-main/web/src/pages/SpaceAccessControl/SpaceAccessControl.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddNewMember.tsx]---
Location: harness-main/web/src/pages/SpaceAccessControl/AddNewMember/AddNewMember.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SpaceSettings.tsx]---
Location: harness-main/web/src/pages/SpaceSettings/SpaceSettings.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeleteSpaceModal.tsx]---
Location: harness-main/web/src/pages/SpaceSettings/DeleteSpaceModal/DeleteSpaceModal.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ExportForm.tsx]---
Location: harness-main/web/src/pages/SpaceSettings/ExportForm/ExportForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GeneralSpaceSettings.tsx]---
Location: harness-main/web/src/pages/SpaceSettings/GeneralSettings/GeneralSpaceSettings.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditableTextField.tsx]---
Location: harness-main/web/src/pages/UserProfile/EditableTextField.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
