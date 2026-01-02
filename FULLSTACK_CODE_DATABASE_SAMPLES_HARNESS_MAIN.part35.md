---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 35
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 35 of 37)

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

---[FILE: ProvideDefaultImage.tsx]---
Location: harness-main/web/src/components/ProvideDefaultImage/ProvideDefaultImage.tsx
Signals: React
Excerpt (<=80 chars):  export const ProvideDefaultImageModal: React.FC<ProvideDefaultImageModalProp...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullReqSuggestionsBatch.tsx]---
Location: harness-main/web/src/components/PullReqSuggestionsBatch/PullReqSuggestionsBatch.tsx
Signals: React
Excerpt (<=80 chars):  export const PullReqSuggestionsBatch: React.FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PullRequestStateLabel.tsx]---
Location: harness-main/web/src/components/PullRequestStateLabel/PullRequestStateLabel.tsx
Signals: React
Excerpt (<=80 chars):  export const PullRequestStateLabel: React.FC<{ data?: TypesPullReq; iconSize...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepoMetadata.tsx]---
Location: harness-main/web/src/components/RepoMetadata/RepoMetadata.tsx
Signals: React
Excerpt (<=80 chars):  export function RepoMetadata() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepoMetadata
```

--------------------------------------------------------------------------------

---[FILE: RepositoryArchivedBanner.tsx]---
Location: harness-main/web/src/components/RepositoryArchivedBanner/RepositoryArchivedBanner.tsx
Signals: React
Excerpt (<=80 chars):  export const RepoArchivedBanner: React.FC<{ isArchived?: boolean; updated?: ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryPageHeader.tsx]---
Location: harness-main/web/src/components/RepositoryPageHeader/RepositoryPageHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function RepositoryPageHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryPageHeader
```

--------------------------------------------------------------------------------

---[FILE: RepoTypeLabel.tsx]---
Location: harness-main/web/src/components/RepoTypeLabel/RepoTypeLabel.tsx
Signals: React
Excerpt (<=80 chars):  export const RepoTypeLabel: React.FC<{ isPublic?: boolean; isArchived?: bool...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ResourceHandlerTable.tsx]---
Location: harness-main/web/src/components/ResourceHandlerTable/ResourceHandlerTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface ResourceHandlerTableData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResourceHandlerTableData
```

--------------------------------------------------------------------------------

---[FILE: ResourceListingPagination.tsx]---
Location: harness-main/web/src/components/ResourceListingPagination/ResourceListingPagination.tsx
Signals: React
Excerpt (<=80 chars): export const ResourceListingPagination: React.FC<ResourceListingPaginationPro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useParsePaginationInfo
- PrevNextPagination
```

--------------------------------------------------------------------------------

---[FILE: RevertPRButton.tsx]---
Location: harness-main/web/src/components/RevertPRButton/RevertPRButton.tsx
Signals: React
Excerpt (<=80 chars):  export interface RevertPRButtonProps extends ButtonProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevertPRButtonProps
```

--------------------------------------------------------------------------------

---[FILE: ReviewerSelect.tsx]---
Location: harness-main/web/src/components/ReviewerSelect/ReviewerSelect.tsx
Signals: React
Excerpt (<=80 chars):  export interface ReviewerSelectProps extends Omit<ButtonProps, 'onSelect'> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReviewerSelectProps
```

--------------------------------------------------------------------------------

---[FILE: RuleViolationAlertModal.tsx]---
Location: harness-main/web/src/components/RuleViolationAlertModal/RuleViolationAlertModal.tsx
Signals: React
Excerpt (<=80 chars): import React from 'react'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RunPipelineModal.tsx]---
Location: harness-main/web/src/components/RunPipelineModal/RunPipelineModal.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ScopeBadge.tsx]---
Location: harness-main/web/src/components/ScopeBadge/ScopeBadge.tsx
Signals: React
Excerpt (<=80 chars):  export const ScopeBadge = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScopeBadge
```

--------------------------------------------------------------------------------

---[FILE: SearchDropDown.tsx]---
Location: harness-main/web/src/components/SearchDropDown/SearchDropDown.tsx
Signals: React
Excerpt (<=80 chars):  export const renderPrincipalIcon = (type: PrincipalType, displayName: string...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- renderPrincipalIcon
```

--------------------------------------------------------------------------------

---[FILE: SearchInputWithSpinner.tsx]---
Location: harness-main/web/src/components/SearchInputWithSpinner/SearchInputWithSpinner.tsx
Signals: React
Excerpt (<=80 chars):  export const SearchInputWithSpinner: React.FC<SearchInputWithSpinnerProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AdvancedSourceCodeEditor.tsx]---
Location: harness-main/web/src/components/SourceCodeEditor/AdvancedSourceCodeEditor.tsx
Signals: React
Excerpt (<=80 chars):  export const AdvancedSourceCodeEditor = React.memo(Editor)

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdvancedSourceCodeEditor
```

--------------------------------------------------------------------------------

---[FILE: EditorUtils.ts]---
Location: harness-main/web/src/components/SourceCodeEditor/EditorUtils.ts
Signals: React
Excerpt (<=80 chars):  export const setForwardedRef = <T>(ref: ForwardedRef<T>, value: T): void => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateDefaultStepInsertionPath
- setForwardedRef
- highlightInsertedYAML
- getStepCount
```

--------------------------------------------------------------------------------

---[FILE: MonacoSourceCodeEditor.tsx]---
Location: harness-main/web/src/components/SourceCodeEditor/MonacoSourceCodeEditor.tsx
Signals: React
Excerpt (<=80 chars):  export const MonacoEditorOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiffEditor
- MonacoEditorOptions
```

--------------------------------------------------------------------------------

---[FILE: SourceCodeEditor.tsx]---
Location: harness-main/web/src/components/SourceCodeEditor/SourceCodeEditor.tsx
Signals: React
Excerpt (<=80 chars):  export const SourceCodeEditor = React.memo(Editor)

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceCodeEditor
```

--------------------------------------------------------------------------------

---[FILE: SourceCodeEditorWithRef.tsx]---
Location: harness-main/web/src/components/SourceCodeEditor/SourceCodeEditorWithRef.tsx
Signals: React
Excerpt (<=80 chars):  export type MonacoCodeEditorRef = editor.IStandaloneCodeEditor

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceCodeEditorWithRef
- MonacoCodeEditorRef
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: harness-main/web/src/components/SourceCodeEditor/types.d.ts
Signals: N/A
Excerpt (<=80 chars):  export const ILanguageFeaturesService: { documentSymbolProvider: unknown }

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- YAMLSymbol
- Model
```

--------------------------------------------------------------------------------

---[FILE: SourceCodeViewer.tsx]---
Location: harness-main/web/src/components/SourceCodeViewer/SourceCodeViewer.tsx
Signals: React
Excerpt (<=80 chars):  export function SourceCodeViewer(props: SourceCodeViewerProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceCodeViewer
```

--------------------------------------------------------------------------------

---[FILE: SpaceSelector.tsx]---
Location: harness-main/web/src/components/SpaceSelector/SpaceSelector.tsx
Signals: React
Excerpt (<=80 chars):  export const SpaceSelector: React.FC<SpaceSelectorProps> = ({ onSelect }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Split.tsx]---
Location: harness-main/web/src/components/Split/Split.tsx
Signals: React
Excerpt (<=80 chars):  export const Split: React.FC<SplitPaneProps> = ({ className, ...props }) => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SuggestionBlock.tsx]---
Location: harness-main/web/src/components/SuggestionBlock/SuggestionBlock.tsx
Signals: N/A
Excerpt (<=80 chars): export interface SuggestionBlock {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SuggestionBlock
```

--------------------------------------------------------------------------------

---[FILE: TabContentWrapper.tsx]---
Location: harness-main/web/src/components/TabContentWrapper/TabContentWrapper.tsx
Signals: React
Excerpt (<=80 chars):  export const TabContentWrapper: React.FC<TabContentWrapperProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabTitleWithCount.tsx]---
Location: harness-main/web/src/components/TabTitleWithCount/TabTitleWithCount.tsx
Signals: React
Excerpt (<=80 chars):  export const TabTitleWithCount: React.FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tabContainerCSS
```

--------------------------------------------------------------------------------

---[FILE: ThreadSection.tsx]---
Location: harness-main/web/src/components/ThreadSection/ThreadSection.tsx
Signals: React
Excerpt (<=80 chars):  export const ThreadSection: React.FC<ThreadSectionProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToggleTabsBtn.tsx]---
Location: harness-main/web/src/components/ToggleTabs/ToggleTabsBtn.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpdateSecretModal.tsx]---
Location: harness-main/web/src/components/UpdateSecretModal/UpdateSecretModal.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddUserModal.tsx]---
Location: harness-main/web/src/components/UserManagementFlows/AddUserModal.tsx
Signals: React
Excerpt (<=80 chars):  export const GeneratedPassword: React.FC<{ password: string }> = ({ password...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ResetPassword.tsx]---
Location: harness-main/web/src/components/UserManagementFlows/ResetPassword.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PRFiltersContext.tsx]---
Location: harness-main/web/src/contexts/PRFiltersContext.tsx
Signals: React
Excerpt (<=80 chars):  export const PRFilterContext = React.createContext<PRFilterContextType | nul...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PRFilterContext
- PRFilterProvider
```

--------------------------------------------------------------------------------

---[FILE: AppErrorBoundary.tsx]---
Location: harness-main/web/src/framework/AppErrorBoundary/AppErrorBoundary.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: registry.ts]---
Location: harness-main/web/src/framework/icons-framework/svg-icon/registry.ts
Signals: N/A
Excerpt (<=80 chars):  export const registerIcon = (name: string, svg: string) => registry.set(name...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerIcon
- unregisterIcon
- getIcon
- hasIcon
- getAllIcons
```

--------------------------------------------------------------------------------

---[FILE: tag.ts]---
Location: harness-main/web/src/framework/icons-framework/svg-icon/tag.ts
Signals: N/A
Excerpt (<=80 chars):  export const TAG = 'svg-icon'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setTagDefaultAttributes
- TAG
- TagProps
```

--------------------------------------------------------------------------------

---[FILE: consts.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/consts.js
Signals: N/A
Excerpt (<=80 chars): export const RuleType = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleType
- IssueLevel
- TargetLibrary
- DefaultOptions
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const highlightContent = (str, attr = '', isError) =>

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- highlightContent
- halt
- pluralIf
```

--------------------------------------------------------------------------------

---[FILE: optimizer.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/optimizer/optimizer.js
Signals: N/A
Excerpt (<=80 chars):  export const optimizeAndVerifySVGContent = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- optimizeAndVerifySVGContent
```

--------------------------------------------------------------------------------

---[FILE: currentColor.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/rules/currentColor.js
Signals: N/A
Excerpt (<=80 chars):  export const currentColorRules = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- currentColorRules
```

--------------------------------------------------------------------------------

---[FILE: viewBox.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/rules/viewBox.js
Signals: N/A
Excerpt (<=80 chars):  export const viewBoxRules = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- viewBoxRules
```

--------------------------------------------------------------------------------

---[FILE: widthHeight.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/rules/widthHeight.js
Signals: N/A
Excerpt (<=80 chars):  export const widthHeightRules = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- widthHeightRules
```

--------------------------------------------------------------------------------

---[FILE: react.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/templates/react.js
Signals: N/A
Excerpt (<=80 chars):  export const renderComponent = ({ iconset, iconName, svg }) =>

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- renderComponent
- renderIndex
- componentFile
- INDEX_FILE
```

--------------------------------------------------------------------------------

---[FILE: template.js]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-cli/templates/template.js
Signals: N/A
Excerpt (<=80 chars):  export function getTemplate(lib = TargetLibrary.REACT) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTemplate
```

--------------------------------------------------------------------------------

---[FILE: Icon.tsx]---
Location: harness-main/web/src/framework/icons-framework/svg-icon-react/Icon.tsx
Signals: React
Excerpt (<=80 chars):  export interface IconProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Icon
- IconType
- IconProps
- NamedIconProps
- IconContextProps
```

--------------------------------------------------------------------------------

---[FILE: languageLoader.ts]---
Location: harness-main/web/src/framework/strings/languageLoader.ts
Signals: N/A
Excerpt (<=80 chars):  export type LangLocale = 'es' | 'en' | 'en-IN' | 'en-US' | 'en-UK'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- languageLoader
- LangLocale
- LanguageRecord
```

--------------------------------------------------------------------------------

---[FILE: String.tsx]---
Location: harness-main/web/src/framework/strings/String.tsx
Signals: React
Excerpt (<=80 chars):  export interface UseStringsReturn {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useStrings
- String
- UseStringsReturn
- StringProps
```

--------------------------------------------------------------------------------

---[FILE: StringsContext.tsx]---
Location: harness-main/web/src/framework/strings/StringsContext.tsx
Signals: React
Excerpt (<=80 chars):  export type StringKeys = keyof StringsMap

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useStringsContext
- StringsContext
- StringKeys
- StringsContextValue
```

--------------------------------------------------------------------------------

---[FILE: StringsContextProvider.tsx]---
Location: harness-main/web/src/framework/strings/StringsContextProvider.tsx
Signals: React
Excerpt (<=80 chars):  export interface StringsContextProviderProps extends Pick<StringsContextValu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StringsContextProvider
- StringsContextProviderProps
```

--------------------------------------------------------------------------------

---[FILE: stringTypes.ts]---
Location: harness-main/web/src/framework/strings/stringTypes.ts
Signals: N/A
Excerpt (<=80 chars): export interface StringsMap {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StringsMap
```

--------------------------------------------------------------------------------

---[FILE: Strings.test.tsx]---
Location: harness-main/web/src/framework/strings/__tests__/Strings.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useCodeLenses.tsx]---
Location: harness-main/web/src/hooks/useCodeLenses.tsx
Signals: React
Excerpt (<=80 chars):  export interface CodeLensCommand {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDocumentSymbols
- getPathFromRange
- UseCodeLenses
- CodeLensCommand
- CodeLensConfig
```

--------------------------------------------------------------------------------

---[FILE: useCodeOPAError.ts]---
Location: harness-main/web/src/hooks/useCodeOPAError.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCodeOPAError(): CodeOPAError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCodeOPAError
```

--------------------------------------------------------------------------------

---[FILE: useConfirmAction.tsx]---
Location: harness-main/web/src/hooks/useConfirmAction.tsx
Signals: React
Excerpt (<=80 chars):  export interface UseConfirmActionDialogProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useConfirmAction
- useConfirmAct
- UseConfirmActionDialogProps
```

--------------------------------------------------------------------------------

---[FILE: useConfirmationDialog.tsx]---
Location: harness-main/web/src/hooks/useConfirmationDialog.tsx
Signals: React
Excerpt (<=80 chars):  export interface UseConfirmationDialogProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useConfirmationDialog
- UseConfirmationDialogProps
- UseConfirmationDialogReturn
```

--------------------------------------------------------------------------------

---[FILE: useDisableCodeMainLinks.ts]---
Location: harness-main/web/src/hooks/useDisableCodeMainLinks.ts
Signals: React
Excerpt (<=80 chars):  export function useDisableCodeMainLinks(disabled: boolean) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDisableCodeMainLinks
```

--------------------------------------------------------------------------------

---[FILE: useDocumentTitle.tsx]---
Location: harness-main/web/src/hooks/useDocumentTitle.tsx
Signals: React
Excerpt (<=80 chars):  export function useDocumentTitle(title: Title) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDocumentTitle
```

--------------------------------------------------------------------------------

---[FILE: useDownloadRawFile.ts]---
Location: harness-main/web/src/hooks/useDownloadRawFile.ts
Signals: React
Excerpt (<=80 chars):  export function useDownloadRawFile() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDownloadRawFile
```

--------------------------------------------------------------------------------

---[FILE: useEmitCodeCommentStatus.ts]---
Location: harness-main/web/src/hooks/useEmitCodeCommentStatus.ts
Signals: React
Excerpt (<=80 chars):  export const PR_COMMENT_STATUS_CHANGED_EVENT = 'PR_COMMENT_STATUS_CHANGED_EV...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEmitCodeCommentStatus
- PR_COMMENT_STATUS_CHANGED_EVENT
- PULL_REQUEST_ALL_COMMENTS_ID
```

--------------------------------------------------------------------------------

---[FILE: useEventListener.ts]---
Location: harness-main/web/src/hooks/useEventListener.ts
Signals: React
Excerpt (<=80 chars):  export function useEventListener<K extends keyof HTMLElementEventMap>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useFindGitBranch.ts]---
Location: harness-main/web/src/hooks/useFindGitBranch.ts
Signals: N/A
Excerpt (<=80 chars):  export function useFindGitBranch(branchName?: string, includeCommit = false) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFindGitBranch
```

--------------------------------------------------------------------------------

---[FILE: useGetCurrentPageScope.tsx]---
Location: harness-main/web/src/hooks/useGetCurrentPageScope.tsx
Signals: N/A
Excerpt (<=80 chars):  export function useGetCurrentPageScope(): ScopeEnum {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGetCurrentPageScope
```

--------------------------------------------------------------------------------

---[FILE: useGetRepositoryMetadata.ts]---
Location: harness-main/web/src/hooks/useGetRepositoryMetadata.ts
Signals: React
Excerpt (<=80 chars):  export function useGetRepositoryMetadata() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGetRepositoryMetadata
```

--------------------------------------------------------------------------------

---[FILE: useGetResourceContent.ts]---
Location: harness-main/web/src/hooks/useGetResourceContent.ts
Signals: N/A
Excerpt (<=80 chars):  export function useGetResourceContent({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGetResourceContent
```

--------------------------------------------------------------------------------

---[FILE: useGetSpaceParam.ts]---
Location: harness-main/web/src/hooks/useGetSpaceParam.ts
Signals: N/A
Excerpt (<=80 chars): export function useGetSpaceParam() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGetSpaceParam
```

--------------------------------------------------------------------------------

---[FILE: useIsSidebarExpanded.ts]---
Location: harness-main/web/src/hooks/useIsSidebarExpanded.ts
Signals: React
Excerpt (<=80 chars): export function useIsSidebarExpanded() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useIsSidebarExpanded
- useCollapseHarnessNav
```

--------------------------------------------------------------------------------

---[FILE: useLiveTimeHook.tsx]---
Location: harness-main/web/src/hooks/useLiveTimeHook.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useLocalStorage.ts]---
Location: harness-main/web/src/hooks/useLocalStorage.ts
Signals: React
Excerpt (<=80 chars): export function isFunction(arg: unknown): arg is Function {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isFunction
```

--------------------------------------------------------------------------------

---[FILE: useModalHook.tsx]---
Location: harness-main/web/src/hooks/useModalHook.tsx
Signals: React
Excerpt (<=80 chars):  export const ModalProvider = ({ container, rootComponent, children }: ModalP...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalProvider
- useModalHook
```

--------------------------------------------------------------------------------

---[FILE: usePageIndex.ts]---
Location: harness-main/web/src/hooks/usePageIndex.ts
Signals: React
Excerpt (<=80 chars):  export function usePageIndex(index = 1) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePageIndex
```

--------------------------------------------------------------------------------

---[FILE: usePRChecksDecision.tsx]---
Location: harness-main/web/src/hooks/usePRChecksDecision.tsx
Signals: React
Excerpt (<=80 chars):  export function usePRChecksDecision({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePRChecksDecision
- PRChecksDecisionResult
```

--------------------------------------------------------------------------------

---[FILE: usePRChecksDecision2.tsx]---
Location: harness-main/web/src/hooks/usePRChecksDecision2.tsx
Signals: React
Excerpt (<=80 chars):  export function usePRChecksDecision({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePRChecksDecision
- PRChecksDecisionResult
```

--------------------------------------------------------------------------------

---[FILE: usePRChecksDecision3.tsx]---
Location: harness-main/web/src/hooks/usePRChecksDecision3.tsx
Signals: React
Excerpt (<=80 chars):  export function usePRChecksDecision({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePRChecksDecision
- PRChecksDecisionResult
```

--------------------------------------------------------------------------------

---[FILE: usePRFiltersContext.tsx]---
Location: harness-main/web/src/hooks/usePRFiltersContext.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: usePublicResourceConfig.tsx]---
Location: harness-main/web/src/hooks/usePublicResourceConfig.tsx
Signals: React
Excerpt (<=80 chars):  export function usePublicResourceConfig() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePublicResourceConfig
```

--------------------------------------------------------------------------------

---[FILE: usePullRequestsData.tsx]---
Location: harness-main/web/src/hooks/usePullRequestsData.tsx
Signals: N/A
Excerpt (<=80 chars):  export const usePullRequestsData = (pageAction: { action: PageAction; timest...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePullRequestsData
```

--------------------------------------------------------------------------------

---[FILE: useQueryParams.ts]---
Location: harness-main/web/src/hooks/useQueryParams.ts
Signals: React
Excerpt (<=80 chars):  export interface UseQueryParamsOptions<T> extends IParseOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UseQueryParamsOptions
```

--------------------------------------------------------------------------------

---[FILE: useResizeObserver.tsx]---
Location: harness-main/web/src/hooks/useResizeObserver.tsx
Signals: React
Excerpt (<=80 chars):  export function useResizeObserver<T extends Element>(ref: RefObject<T>, call...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useResourcePath.ts]---
Location: harness-main/web/src/hooks/useResourcePath.ts
Signals: N/A
Excerpt (<=80 chars):  export function useResourcePath(): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useResourcePath
```

--------------------------------------------------------------------------------

---[FILE: useRuleViolationCheck.tsx]---
Location: harness-main/web/src/hooks/useRuleViolationCheck.tsx
Signals: React
Excerpt (<=80 chars):  export const useRuleViolationCheck = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRuleViolationCheck
```

--------------------------------------------------------------------------------

---[FILE: useScheduleJob.ts]---
Location: harness-main/web/src/hooks/useScheduleJob.ts
Signals: React
Excerpt (<=80 chars):  export function useScheduleJob<T>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useScrollTop.ts]---
Location: harness-main/web/src/hooks/useScrollTop.ts
Signals: React
Excerpt (<=80 chars): export function useScrollTop() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useScrollTop
```

--------------------------------------------------------------------------------

---[FILE: useSetPageContainerWidthVar.tsx]---
Location: harness-main/web/src/hooks/useSetPageContainerWidthVar.tsx
Signals: React
Excerpt (<=80 chars): export function useSetPageContainerWidthVar({ domRef }: { domRef: React.RefOb...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSetPageContainerWidthVar
```

--------------------------------------------------------------------------------

---[FILE: useShowRequestError.ts]---
Location: harness-main/web/src/hooks/useShowRequestError.ts
Signals: React
Excerpt (<=80 chars):  export function useShowRequestError(error: GetDataError<Unknown> | null, tim...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useShowRequestError
```

--------------------------------------------------------------------------------

---[FILE: useSpaceSSE.tsx]---
Location: harness-main/web/src/hooks/useSpaceSSE.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useUpdateQueryParams.ts]---
Location: harness-main/web/src/hooks/useUpdateQueryParams.ts
Signals: N/A
Excerpt (<=80 chars):  export interface UseUpdateQueryParamsReturn<T> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UseUpdateQueryParamsReturn
```

--------------------------------------------------------------------------------

---[FILE: useUserPreference.ts]---
Location: harness-main/web/src/hooks/useUserPreference.ts
Signals: React
Excerpt (<=80 chars):  export function useUserPreference<T = string>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: harness-main/web/src/images/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const Images = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Images
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: harness-main/web/src/layouts/layout.tsx
Signals: React
Excerpt (<=80 chars):  export const LayoutWithSideNav: React.FC<LayoutWithSideNavProps> = ({ title,...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DefaultMenu.tsx]---
Location: harness-main/web/src/layouts/menu/DefaultMenu.tsx
Signals: React
Excerpt (<=80 chars):  export const DefaultMenu: React.FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: NavMenuItem.tsx]---
Location: harness-main/web/src/layouts/menu/NavMenuItem.tsx
Signals: React
Excerpt (<=80 chars):  export const NavMenuItem: React.FC<NavMenuItemProps> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: NotFoundPage.tsx]---
Location: harness-main/web/src/pages/404/NotFoundPage.tsx
Signals: React
Excerpt (<=80 chars): export const NotFoundPage: React.FC = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddUpdatePipeline.tsx]---
Location: harness-main/web/src/pages/AddUpdatePipeline/AddUpdatePipeline.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Constants.ts]---
Location: harness-main/web/src/pages/AddUpdatePipeline/Constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_YAML_PATH_PREFIX = '.harness/'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_YAML_PATH_PREFIX
- DEFAULT_YAML_PATH_SUFFIX
- DRONE_CONFIG_YAML_FILE_SUFFIXES
- V1_SCHEMA_YAML_FILE_REGEX
```

--------------------------------------------------------------------------------

---[FILE: ChangePassword.tsx]---
Location: harness-main/web/src/pages/ChangePassword/ChangePassword.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Compare.tsx]---
Location: harness-main/web/src/pages/Compare/Compare.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CompareCommits.tsx]---
Location: harness-main/web/src/pages/Compare/CompareCommits.tsx
Signals: React
Excerpt (<=80 chars):  export const CompareCommits: React.FC<CommitProps> = ({ repoMetadata, source...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CompareContentHeader.tsx]---
Location: harness-main/web/src/pages/Compare/CompareContentHeader/CompareContentHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function CompareContentHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CompareContentHeader
```

--------------------------------------------------------------------------------

---[FILE: Execution.tsx]---
Location: harness-main/web/src/pages/Execution/Execution.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ExecutionList.tsx]---
Location: harness-main/web/src/pages/ExecutionList/ExecutionList.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Home.tsx]---
Location: harness-main/web/src/pages/Home/Home.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
